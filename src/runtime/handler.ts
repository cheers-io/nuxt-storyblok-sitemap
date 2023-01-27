import { useRuntimeConfig } from "#imports";
import {
  defineEventHandler,
  setResponseHeader,
  createError,
  sendStream,
} from "h3";
import { SitemapStream } from "sitemap";
import type { Story, ModulePrivateRuntimeConfig } from "../module";

interface SitemapDraft {
  url: string;
  lastmod?: string;
  lang: string;
}

interface SitemapEntity {
  url: string;
  lastmod?: string;
  links?: { url: string; lang: string }[];
}

export default defineEventHandler(async (ev) => {
  const {
    storyblokSitemap: {
      accessToken,
      baseUrl,
      defaultLocale,
      blacklist,
      apiUrl,
      perPage,
    },
  } = useRuntimeConfig() as { storyblokSitemap: ModulePrivateRuntimeConfig };

  // a container that holds all the stories returned by (possibly multiple) API requests
  const allStories = [];

  const createStoriesFetcher = (
    url: string,
    params: Record<string, string>
  ) => {
    const _url = new URL(url);
    const _params = new URLSearchParams(params);

    return (page: number) => {
      _params.set("page", String(page));
      _url.search = _params.toString();

      return $fetch.raw<{ stories: Story[] }>(_url.toString());
    };
  };
  const getStoriesByPage = createStoriesFetcher(apiUrl, {
    token: accessToken,
    per_page: String(perPage),
  });

  const toSitemapDrafts = (story: Story): SitemapDraft[] => {
    // format the main story
    const mainStory = {
      url: story.path ? story.path : `/${story.full_slug}`,
      lastmod: story.published_at,
      lang: defaultLocale,
    };
    // and all its translated variations (if exist)
    const translatedStories =
      story.translated_slugs?.map(({ lang, path }) => {
        return {
          url: `/${lang}/${path === "home" ? "" : path}`,
          lastmod: story.published_at,
          lang,
        };
      }) || [];
    return [mainStory].concat(translatedStories);
  };

  const toSitemapEntries = (drafts: SitemapDraft[]): SitemapEntity[] => {
    if (drafts.length === 1) {
      const [{ url, lastmod }] = drafts;
      return [{ url, lastmod }];
    }
    const links = drafts.map(({ url, lang }) => ({ url, lang }));
    return drafts.reduce<SitemapEntity[]>((acc, { url, lastmod }) => {
      acc.push({ url, lastmod, links });
      return acc;
    }, []);
  };

  setResponseHeader(ev, "Content-Type", "application/xml");

  try {
    const { headers, _data } = await getStoriesByPage(1);

    // put stories from the 1st page to the container
    // TODO: shameless "!" non-null assertion operator
    allStories.push(..._data!.stories);

    // find out how many stories are available
    // TODO: shameless "as" type assertion
    const { total } = headers as Headers & { total: string };
    // and how many pages are needed to fetch
    const maxPage = Math.ceil(Number(total) / perPage);
    // a container that holds all the promises for the 2nd page and following
    const promises = [];

    // checks if there is a need to fetch other pages, starting with 2nd
    for (let pageToFetch = 2; pageToFetch <= maxPage; pageToFetch += 1) {
      promises.push(getStoriesByPage(pageToFetch));
    }

    // resolves immediately when just 1 page available since the array is empty
    // otherwise resolves after all page requests are resolved
    const responses = await Promise.all(promises);
    responses.forEach(({ _data }) => {
      // put stories from the 2nd page and following to the container
      // TODO: shameless "!" non-null assertion operator
      allStories.push(..._data!.stories);
    });

    // filter out blacklisted pages
    const notBlacklisted = !blacklist.length
      ? allStories
      : allStories.filter((story) =>
          blacklist.every(
            (regex: string) => story.full_slug.match(new RegExp(regex)) === null
          )
        );

    const smStream = new SitemapStream({
      // TODO: shameless "!" non-null assertion operator
      hostname: new URL(ev.node.req.url!, baseUrl).origin,
      xmlns: {
        // XML namespaces to turn on
        news: false,
        xhtml: true,
        image: false,
        video: false,
      },
    });

    notBlacklisted.forEach((story) => {
      const drafts = toSitemapDrafts(story);
      const entries = toSitemapEntries(drafts);

      entries.forEach((entry) => {
        smStream.write(entry);
      });
    });

    smStream.end();

    return sendStream(ev, smStream);
  } catch (error) {
    return createError({
      statusCode: 404,
      statusMessage: error instanceof Error ? error.message : "NotFound",
    });
  }
});
