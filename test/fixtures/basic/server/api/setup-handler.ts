import { defineEventHandler } from "h3";
import { StoryblokResponse } from "@/../src/types";

export const setupHandler = (response: StoryblokResponse) => {
  return defineEventHandler((ev) => {
    const { per_page, page } = getQuery(ev);

    setHeader(ev, "total", response.stories.length);

    if (per_page && page) {
      const from = Number(per_page) * (Number(page) - 1);
      const to = from + Number(per_page);

      return {
        cv: response.cv,
        stories: response.stories.slice(from, to),
      };
    }

    return response;
  });
};
