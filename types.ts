import { type } from "os";

export interface CollectionItem {
  id: string;
  title: string;
  type: 'men' | 'women' | 'accessories' | 'all';
  desc: string;
  imgUrl: string;
}

export interface CustomOrder {
  id: string;
  garment: string;
  height: number;
  weight: number | null;
  chest: number;
  waist: number;
  fabric: string;
  color: string;
  notes: string;
  email: string; // Added email field
  referenceImageBase64?: string; // Added reference image field
  created: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // e.g., "January 15, 2025"
  author: string;
  imageUrl: string;
  excerpt: string; // Short summary
  content: string; // Full blog post content (can be Markdown)
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface AIChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}