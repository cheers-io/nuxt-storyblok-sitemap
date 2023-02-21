import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("missed baseUrl", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    nuxtConfig: {
      modules: ["../src/module"],
      storyblokSitemap: {
        accessToken: "fake-token",
        baseUrl: "",
        defaultLocale: "en",
      },
    },
  });

  it("doesn't create a sitemap when no baseUrl is provided", async () => {
    const htmlString = await $fetch("/sitemap.xml");

    expect(htmlString).toContain("<!DOCTYPE html>");
    expect(htmlString).toContain("<div>basic</div>");
  });
});
