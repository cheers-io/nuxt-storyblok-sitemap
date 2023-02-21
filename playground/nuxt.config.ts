export default defineNuxtConfig({
  modules: ["../src/module"],
  storyblokSitemap: {
    accessToken: "",
    baseUrl: "https://example.com/",
    defaultLocale: "en",
    apiUrl: "/api/stories",
    blacklist: ["^global/", "^page-not-found$", "^job/"],
  },
});
