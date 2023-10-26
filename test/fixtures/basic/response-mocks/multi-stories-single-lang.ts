import { StoryblokResponse } from "@/../src/types";

export const response: StoryblokResponse = {
  stories: new Array(120).fill({
    published_at: "2020-12-24T09:30:45.922Z",
    full_slug: "my-page",
    path: "/my-page",
    lang: "default",
  }),
  cv: 1608802245,
};
