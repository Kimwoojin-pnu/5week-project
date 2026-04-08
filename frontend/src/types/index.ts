export interface User {
  id: number;
  email: string;
  name: string;
  picture: string | null;
  plan: 'free' | 'pro';
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  is_free: boolean;
  order: number;
}

export interface ChapterDetail extends Chapter {
  content: string;
  code_examples: CodeExample[];
}

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}
