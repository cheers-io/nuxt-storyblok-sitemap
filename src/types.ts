export type Story = {
  published_at: string;
  full_slug: string;
  path?: string;
  lang: string;
  translated_slugs?: {
    path: string;
    lang: Story["lang"];
  }[];
};

export type StoryblokResponse = { stories: Story[]; cv: number };
