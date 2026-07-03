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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      frc_trivia: {
        Row: {
          answer_type: string | null
          answers: string
          core_category: string | null
          difficulty: string | null
          era: string | null
          question: string
        }
        Insert: {
          answer_type?: string | null
          answers: string
          core_category?: string | null
          difficulty?: string | null
          era?: string | null
          question: string
        }
        Update: {
          answer_type?: string | null
          answers?: string
          core_category?: string | null
          difficulty?: string | null
          era?: string | null
          question?: string
        }
        Relationships: []
      }
      frcdle_all: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_ca: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fch: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fim: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fin: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fit: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fma: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fnc: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_fsc: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_isr: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_ne: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_ont: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_pch: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_pnw: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_regionals: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_team_data: {
        Row: {
          area: string | null
          areaRank: number | null
          awardNum: number | null
          epaRank: number | null
          numYearsParticipating: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          area?: string | null
          areaRank?: number | null
          awardNum?: number | null
          epaRank?: number | null
          numYearsParticipating?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          area?: string | null
          areaRank?: number | null
          awardNum?: number | null
          epaRank?: number | null
          numYearsParticipating?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
      frcdle_win: {
        Row: {
          areaRank: number | null
          epaRank: number | null
          rookieYear: number | null
          teamName: string | null
          teamNum: number
          timestamp: string
          totalNumTeams: number | null
          unitlessEPA: number | null
          worldEPARank: number | null
        }
        Insert: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Update: {
          areaRank?: number | null
          epaRank?: number | null
          rookieYear?: number | null
          teamName?: string | null
          teamNum?: number
          timestamp?: string
          totalNumTeams?: number | null
          unitlessEPA?: number | null
          worldEPARank?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
