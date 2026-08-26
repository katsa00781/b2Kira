// ============================================================
// Supabase adatbázis típusok – GENERÁLT FÁJL, ne szerkeszd kézzel.
//
// Forrás: familyBudget projekt (eguhipjgnhbajbmnrskm) public sémája,
// `supabase gen types typescript` kimenete, **a `breathing_` táblákra
// szűkítve**. A familyBudget pénzügyi táblái szándékosan nincsenek benne
// (lásd docs/feature-tasks.md – D-007).
//
// Újragenerálás után a szűrést újra el kell végezni.
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      breathing_children: {
        Row: {
          age: number | null
          character_id: string
          created_at: string
          id: string
          last_session_date: string | null
          level: number
          name: string
          parent_id: string
          streak_days: number
          updated_at: string
        }
        Insert: {
          age?: number | null
          character_id?: string
          created_at?: string
          id?: string
          last_session_date?: string | null
          level?: number
          name: string
          parent_id: string
          streak_days?: number
          updated_at?: string
        }
        Update: {
          age?: number | null
          character_id?: string
          created_at?: string
          id?: string
          last_session_date?: string | null
          level?: number
          name?: string
          parent_id?: string
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      breathing_sessions: {
        Row: {
          character_id: string
          child_id: string
          completed: boolean
          created_at: string
          cycles_completed: number
          duration_seconds: number
          exercise_key: string
          id: string
          started_at: string
        }
        Insert: {
          character_id?: string
          child_id: string
          completed?: boolean
          created_at?: string
          cycles_completed?: number
          duration_seconds: number
          exercise_key?: string
          id?: string
          started_at?: string
        }
        Update: {
          character_id?: string
          child_id?: string
          completed?: boolean
          created_at?: string
          cycles_completed?: number
          duration_seconds?: number
          exercise_key?: string
          id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "breathing_children"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_settings: {
        Row: {
          child_id: string
          haptics_on: boolean
          reminder_on: boolean
          reminder_time: string
          session_length_key: string
          sound_on: boolean
          updated_at: string
          voice_on: boolean
        }
        Insert: {
          child_id: string
          haptics_on?: boolean
          reminder_on?: boolean
          reminder_time?: string
          session_length_key?: string
          sound_on?: boolean
          updated_at?: string
          voice_on?: boolean
        }
        Update: {
          child_id?: string
          haptics_on?: boolean
          reminder_on?: boolean
          reminder_time?: string
          session_length_key?: string
          sound_on?: boolean
          updated_at?: string
          voice_on?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "breathing_settings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "breathing_children"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_stickers: {
        Row: {
          child_id: string
          earned_at: string
          id: string
          sticker_key: string
        }
        Insert: {
          child_id: string
          earned_at?: string
          id?: string
          sticker_key: string
        }
        Update: {
          child_id?: string
          earned_at?: string
          id?: string
          sticker_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_stickers_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "breathing_children"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      breathing_owns_child: { Args: { p_child_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
