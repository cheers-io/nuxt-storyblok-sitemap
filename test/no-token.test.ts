import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("missed accessToken", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    nuxtConfig: {
      modules: ["../src/module"],
      storyblokSitemap: {
        accessToken: "",
        baseUrl: "https://example.com",
        defaultLocale: "en",
      },
    },
  });

  it("doesn't create a sitemap when no accessToken is provided", async () => {
    const htmlString = await $fetch("/sitemap.xml");

    expect(htmlString).toContain("<!DOCTYPE html>");
    expect(htmlString).toContain("<div>basic</div>");
  });
});
