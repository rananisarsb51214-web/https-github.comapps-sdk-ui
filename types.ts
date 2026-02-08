export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'discord' | 'github' | 'email' | 'other';
  url: string;
  label: string;
  icon: string;
  color: string;
}

export interface PostTemplate {
  id: string;
  content: string;
  theme: 'modern' | 'gradient' | 'minimal' | 'glass' | 'sunset' | 'ocean' | 'forest' | 'midnight';
  image?: string | null;
  textColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export type ViewState = 'home' | 'editor' | 'admin' | 'studio';