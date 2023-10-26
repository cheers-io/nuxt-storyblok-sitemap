// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("missed defaultLocale", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    nuxtConfig: {
      storyblokSitemap: {
        accessToken: "fake-token",
        baseUrl: "https://example.com",
        apiUrl: "/api/multi-stories-multi-lang",
      },
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

  it("creates a single-lang sitemap even for multi-lang source", async () => {
    const urls = dom.getElementsByTagName("url");
    expect(urls).toHaveLength(120);
  });
});
