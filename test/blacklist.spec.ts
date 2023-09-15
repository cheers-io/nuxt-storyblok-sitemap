// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { ModuleOptions } from "../src/module";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/blacklist",
  blacklist: ["^bad-"],
} satisfies Partial<ModuleOptions>;

describe("blacklist", async () => {
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

  it("renders only one page", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(1);
  });

  it("renders only good page", async () => {
    const [url] = dom.getElementsByTagName("url");
    const loc = url.getElementsByTagName("loc")[0]?.textContent;
    expect(loc).toContain("good-");
  });
});
