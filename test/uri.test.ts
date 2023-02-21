// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";
import { ModuleOptions } from "../src/module";

const storyblokSitemapConfig = {
  accessToken: "fake-token",
  baseUrl: "https://example.com",
  defaultLocale: "en",
  apiUrl: "/api/single-story-single-lang",
  uri: "custom-address.xml",
} satisfies Partial<ModuleOptions>;

describe("uri", async () => {
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

  it("doesn't create a sitemap by default path", async () => {
    const htmlString = await $fetch("/sitemap.xml");

    expect(htmlString).toContain("<!DOCTYPE html>");
    expect(htmlString).toContain("<div>basic</div>");
  });

  it.only("creates a sitemap by the custom path", async () => {
    const xml = await $fetch(`/${storyblokSitemapConfig.uri}`);

    const domParser = new DOMParser();
    dom = domParser.parseFromString(xml, "application/xml");

    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(1);
  });
});
