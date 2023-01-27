export default defineNuxtConfig({
  modules: ["../../../src/module"],
  storyblokSitemap: {
    accessToken: "abc",
    baseUrl: "https://google.com",
    defaultLocale: "en",
  },
});
