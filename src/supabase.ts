export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      components: {
        Row: {
          category: string | null
          constructor_brand: string
          created_at: string
          hash: string | null
          id: string
          label: string
          media_path: string | null
          price_market: number
          sublabel: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          constructor_brand: string
          created_at?: string
          hash?: string | null
          id?: string
          label: string
          media_path?: string | null
          price_market: number
          sublabel?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          constructor_brand?: string
          created_at?: string
          hash?: string | null
          id?: string
          label?: string
          media_path?: string | null
          price_market?: number
          sublabel?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
