// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { response } from "./fixtures/basic/response-mocks/single-story-single-lang";
import { getAbsoluteUrl } from "./utils";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/single-story-single-lang",
};

describe("single-story-single-lang", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    nuxtConfig: {
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

  it("has just one url element", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(1);
  });

  it("has correct loc and lastmod elements", async () => {
    const url = dom.getElementsByTagName("url")[0];
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

  it("has no link elements", async () => {
    const url = dom.getElementsByTagName("url")[0];
    const links = url.getElementsByTagName("xhtml:link");

    expect(links).toHaveLength(0);
  });
});
