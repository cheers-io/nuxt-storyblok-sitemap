export default defineNuxtConfig({
  modules: ["../src/module"],
  storyblokSitemap: {
    accessToken: process.env.ACCESS_TOKEN,
    baseUrl: process.env.BASE_URL,
    defaultLocale: process.env.DEFAULT_LOCALE,
    blacklist: process.env.BLACKLIST?.split(',') || [],
  },
  compatibilityDate: "2024-11-07",
});
