export default defineNuxtConfig({
  modules: ["../src/module"],
  storyblokSitemap: {
    accessToken: "",
    baseUrl: "https://example.com/",
    defaultLocale: "en",
    blacklist: ["^global/", "^page-not-found$", "^job/"],
  },
});
