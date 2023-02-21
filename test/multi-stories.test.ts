// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { ModuleOptions } from "../src/module";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/multi-stories",
} satisfies Partial<ModuleOptions>;

describe("multi-stories", async () => {
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

  it("renders all stories from multiple responses", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(240);
  });
});
