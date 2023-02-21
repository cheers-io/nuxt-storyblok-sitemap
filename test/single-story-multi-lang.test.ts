// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { response } from "./fixtures/basic/response-mocks/single-story-multi-lang";
import { ModuleOptions } from "../src/module";
import { getAbsoluteUrl } from "./utils";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/single-story-multi-lang",
} satisfies Partial<ModuleOptions>;

describe("single-story-multi-lang", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    nuxtConfig: {
      modules: ["../src/module"],
      storyblokSitemap: storyblokSitemapConfig,
    },
  });

  let dom: Document;

  beforeEach(async () => {
    if (dom) {
      return;
    }
    const xml = await $fetch("/sitemap.xml");
    const domParser = new DOMParser();
    dom = domParser.parseFromString(xml, "application/xml");
  });

  it("has two url elements", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(2);
  });

  it("first url element data is linked to original story", async () => {
    const [url] = dom.getElementsByTagName("url");

    const loc = url.getElementsByTagName("loc")[0]?.textContent;
    const lastmod = url.getElementsByTagName("lastmod")[0]?.textContent;

    expect(loc).toBe(
      getAbsoluteUrl(
        storyblokSitemapConfig.baseUrl,
        response.stories[0].full_slug
      )
    );
    expect(lastmod).toBe(response.stories[0].published_at);
  });

  it("url elements are cross-linked via links", async () => {
    const [url1, url2] = dom.getElementsByTagName("url");

    const url1Links = url1.getElementsByTagName("xhtml:link");
    const url2Links = url2.getElementsByTagName("xhtml:link");
    expect(url1Links).toHaveLength(2);
    expect(url2Links).toHaveLength(2);

    [url1Links, url2Links].forEach(([link1, link2]) => {
      expect(link1.getAttribute("hreflang")).toBe("en");
      expect(link1.getAttribute("href")).toBe(
        getAbsoluteUrl(
          storyblokSitemapConfig.baseUrl,
          response.stories[0].full_slug
        )
      );
      expect(link2.getAttribute("hreflang")).toBe("de");
      expect(link2.getAttribute("href")).toBe(
        getAbsoluteUrl(
          storyblokSitemapConfig.baseUrl,
          response.stories[0].translated_slugs![0].path,
          response.stories[0].translated_slugs![0].lang
        )
      );
    });
  });
});
