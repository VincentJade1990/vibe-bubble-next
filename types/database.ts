export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          url_pattern: string | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          url_pattern?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          url_pattern?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          color: string | null
          description: string | null
          usage_count: number | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string | null
          description?: string | null
          usage_count?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string | null
          description?: string | null
          usage_count?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      candidates: {
        Row: {
          id: string
          title: string | null
          source_url: string
          source_platform: string | null
          author_name: string | null
          author_url: string | null
          raw_text: string | null
          raw_images: string[] | null
          cover_image_url: string | null
          discovered_by: string | null
          discovered_at: string | null
          review_status: string
          editor_note: string | null
          converted_inspiration_id: string | null
          meta_title: string | null
          meta_description: string | null
          meta_og_image: string | null
          parsed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          source_url: string
          source_platform?: string | null
          author_name?: string | null
          author_url?: string | null
          raw_text?: string | null
          raw_images?: string[] | null
          cover_image_url?: string | null
          discovered_by?: string | null
          discovered_at?: string | null
          review_status?: string
          editor_note?: string | null
          converted_inspiration_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_og_image?: string | null
          parsed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          source_url?: string
          source_platform?: string | null
          author_name?: string | null
          author_url?: string | null
          raw_text?: string | null
          raw_images?: string[] | null
          cover_image_url?: string | null
          discovered_by?: string | null
          discovered_at?: string | null
          review_status?: string
          editor_note?: string | null
          converted_inspiration_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_og_image?: string | null
          parsed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      inspirations: {
        Row: {
          id: string
          title: string
          short_title: string | null
          slug: string
          summary: string | null
          description: string | null
          source_url: string | null
          source_platform: string | null
          author_name: string | null
          author_url: string | null
          cover_image_url: string | null
          gallery_images: string[] | null
          project_type: string | null
          difficulty: string | null
          estimated_time: string | null
          target_users: string[] | null
          tools: string[] | null
          tags: string[] | null
          why_recommend: string | null
          highlights: string[] | null
          remix_ideas: string[] | null
          replication_steps: string[] | null
          prompt_templates: Json | null
          publish_tips: string[] | null
          status: string
          is_featured: boolean | null
          allow_random: boolean | null
          view_count: number | null
          source_click_count: number | null
          like_count: number | null
          favorite_count: number | null
          comment_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          short_title?: string | null
          slug: string
          summary?: string | null
          description?: string | null
          source_url?: string | null
          source_platform?: string | null
          author_name?: string | null
          author_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[] | null
          project_type?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          target_users?: string[] | null
          tools?: string[] | null
          tags?: string[] | null
          why_recommend?: string | null
          highlights?: string[] | null
          remix_ideas?: string[] | null
          replication_steps?: string[] | null
          prompt_templates?: Json | null
          publish_tips?: string[] | null
          status?: string
          is_featured?: boolean | null
          allow_random?: boolean | null
          view_count?: number | null
          source_click_count?: number | null
          like_count?: number | null
          favorite_count?: number | null
          comment_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          short_title?: string | null
          slug?: string
          summary?: string | null
          description?: string | null
          source_url?: string | null
          source_platform?: string | null
          author_name?: string | null
          author_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[] | null
          project_type?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          target_users?: string[] | null
          tools?: string[] | null
          tags?: string[] | null
          why_recommend?: string | null
          highlights?: string[] | null
          remix_ideas?: string[] | null
          replication_steps?: string[] | null
          prompt_templates?: Json | null
          publish_tips?: string[] | null
          status?: string
          is_featured?: boolean | null
          allow_random?: boolean | null
          view_count?: number | null
          source_click_count?: number | null
          like_count?: number | null
          favorite_count?: number | null
          comment_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          nickname: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          nickname?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nickname?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          inspiration_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          inspiration_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          inspiration_id?: string
          created_at?: string | null
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          inspiration_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          inspiration_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          inspiration_id?: string
          created_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          inspiration_id: string
          content: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          inspiration_id: string
          content: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          inspiration_id?: string
          content?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          source_url: string | null
          source_platform: string | null
          author_name: string | null
          cover_image_url: string | null
          project_type: string | null
          tags: string[] | null
          status: string
          admin_note: string | null
          converted_inspiration_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          source_url?: string | null
          source_platform?: string | null
          author_name?: string | null
          cover_image_url?: string | null
          project_type?: string | null
          tags?: string[] | null
          status?: string
          admin_note?: string | null
          converted_inspiration_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          source_url?: string | null
          source_platform?: string | null
          author_name?: string | null
          cover_image_url?: string | null
          project_type?: string | null
          tags?: string[] | null
          status?: string
          admin_note?: string | null
          converted_inspiration_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
