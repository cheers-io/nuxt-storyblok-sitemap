// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/multi-stories-single-lang",
};

describe("multi-stories-single-lang", async () => {
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

  it("renders all stories from multiple responses", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(120);
  });
});
