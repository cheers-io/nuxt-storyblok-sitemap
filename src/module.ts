import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";

// Module options TypeScript inteface definition
export interface ModuleOptions {
  accessToken?: string;
  baseUrl?: string;
  defaultLocale: string;
  blacklist: string[];
  apiUrl: string;
  uri: string;
}

const moduleName = "@cheers-io/nuxt-storyblok-sitemap";
const configKey = "storyblokSitemap";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: moduleName,
    configKey,
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    defaultLocale: "",
    blacklist: [],
    apiUrl: "https://api.storyblok.com/v2/cdn/stories",
    uri: "sitemap.xml",
  },
  async setup(options, nuxt) {
    if (!options.accessToken) {
      console.warn(`${moduleName}: accessToken is not provided`);
      return;
    }

    if (!options.baseUrl) {
      console.warn(`${moduleName}: baseUrl is not provided`);
      return;
    }

    const resolver = createResolver(import.meta.url);

    // pass module config to the runtime
    nuxt.options.runtimeConfig[configKey] = {
      accessToken: options.accessToken,
      baseUrl: options.baseUrl,
      defaultLocale: options.defaultLocale,
      blacklist: options.blacklist,
      apiUrl: options.apiUrl,
      perPage: 100,
    };

    addServerHandler({
      route: `/${options.uri}`,
      handler: resolver.resolve("./runtime/handler"),
    });
  },
});
