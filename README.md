# Nuxt Storyblok sitemap

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Generates a sitemap for content provided by Storyblok

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- Dynamic sitemap generation
- Per page filtering
- Multilingual support

## Quick Setup

1. Add `@cheers-io/nuxt-storyblok-sitemap` dependency to your project

```bash
# Using npm
npm install @cheers-io/nuxt-storyblok-sitemap

# Using pnpm
pnpm add @cheers-io/nuxt-storyblok-sitemap

# Using yarn
yarn add @cheers-io/nuxt-storyblok-sitemap
```

2. Add `@cheers-io/nuxt-storyblok-sitemap` to the `modules` section of `nuxt.config.ts`. Сonfiguration object can be passed in one of the following ways

```js
export default defineNuxtConfig({
  modules: ["@cheers-io/nuxt-storyblok-sitemap"],
  storyblokSitemap: {
    // config object
  },
});
```

or

```js
export default defineNuxtConfig({
  modules: [
    "@cheers-io/nuxt-storyblok-sitemap",
    {
      // config object
    },
  ],
});
```

3. Configuration object interface

```js
{
  // accessToken for Storyblok API
  // required
  accessToken: string;

  // base URL to be used for the sitemap generation
  // required
  baseUrl: string;

  // default locale to be used for the original stories
  // required
  defaultLocale: string;

  // can be used to filter out stories by full_slug via RegExp
  // optional, default []
  blacklist: string[];

  // Storyblok API url
  // optional, default "https://api.storyblok.com/v2/cdn/stories"
  apiUrl: string;

  // path to the sitemap file, relative to the website domain
  // optional, default "sitemap.xml"
  uri: string;
}
```

That's it! You can now use Nuxt Storyblok sitemap in your Nuxt app ✨

## Blacklist details

There is a chance you want to hide some pages from the generated sitemap. For example, you don't want to include stories that _start_ with `global/*`. Or you want to hide any story which slug _includes_ `hidden` part. Or maybe you don't want to see stories which _end_ with `/private` word.
In this case your config might look like this:

```js
{
  blacklist: ["^global/", "hidden", "/private$"];
}
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## Contact

Follow us on [Twitter](https://twitter.com/cheers_io), [LinkedIn](https://www.linkedin.com/company/cheers-io/) or visit our [website](https://www.cheers.io/). You can also write us an [email](mailto:hello@cheers.io).

## License

This project is licensed under the MIT license. For more information see the [LICENSE](LICENSE.md) file.

Copyright 2023 - [cheers digital solutions GmbH](https://www.cheers.io/)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@cheers-io/nuxt-storyblok-sitemap/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@cheers-io/nuxt-storyblok-sitemap
[npm-downloads-src]: https://img.shields.io/npm/dm/@cheers-io/nuxt-storyblok-sitemap.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@cheers-io/nuxt-storyblok-sitemap
[license-src]: https://img.shields.io/npm/l/@cheers-io/nuxt-storyblok-sitemap.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@cheers-io/nuxt-storyblok-sitemap
