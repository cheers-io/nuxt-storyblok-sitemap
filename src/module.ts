import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";

export interface Story {
  published_at: string;
  slug: string;
  full_slug: string;
  path?: string;
  lang: string;
  translated_slugs?: {
    path: string;
    lang: Story["lang"];
  }[];
}

// Module options TypeScript inteface definition
export interface ModuleOptions {
  accessToken?: string;
  baseUrl?: string;
  defaultLocale?: string;
  blacklist: string[];
  apiUrl: string;
}

export interface ModulePrivateRuntimeConfig {
  accessToken: string;
  baseUrl: string;
  defaultLocale: string;
  blacklist: string[];
  apiUrl: string;
  perPage: number;
}

const moduleName = "nuxt-storyblok-sitemap";
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
    blacklist: [],
    apiUrl: "https://api.storyblok.com/v2/cdn/stories",
  },
  async setup(options, nuxt) {
    if (!options.accessToken) {
      throw new Error(`${moduleName}: accessToken is not provided`);
    }

    if (!options.baseUrl) {
      throw new Error(`${moduleName}: baseUrl is not provided`);
    }

    if (!options.defaultLocale) {
      throw new Error(`${moduleName}: defaultLocale is not provided`);
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
      route: "/sitemap.xml",
      handler: resolver.resolve("./runtime/handler"),
    });
  },
});
