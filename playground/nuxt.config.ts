export default defineNuxtConfig({
  modules: ["../src/module"],
  storyblokSitemap: {
    accessToken: "",
    baseUrl: "https://google.com",
    defaultLocale: "en",
    blacklist: ["^global/", "^page-not-found$", "^job/"],
  },
});
