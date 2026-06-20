export type HabitFrequency = "daily" | "weekly" | "custom";
export type HabitType = "build" | "quit";
export type CategoryType = "build" | "quit";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          category_type: CategoryType;
          icon: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          category_type: CategoryType;
          icon?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          category_type?: CategoryType;
          icon?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string | null;
          frequency: HabitFrequency;
          frequency_days: number[] | null;
          start_date: string;
          archived_at: string | null;
          habit_type: HabitType;
          category_id: string | null;
          target_minutes: number | null;
          reminder_enabled: boolean;
          reminder_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
          icon?: string | null;
          frequency?: HabitFrequency;
          frequency_days?: number[] | null;
          start_date?: string;
          archived_at?: string | null;
          habit_type?: HabitType;
          category_id?: string | null;
          target_minutes?: number | null;
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string | null;
          frequency?: HabitFrequency;
          frequency_days?: number[] | null;
          start_date?: string;
          archived_at?: string | null;
          habit_type?: HabitType;
          category_id?: string | null;
          target_minutes?: number | null;
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id?: string;
          completed_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: {
      habit_streaks: {
        Row: {
          habit_id: string;
          user_id: string;
          name: string;
          current_streak: number;
          longest_streak: number;
          last_completed_date: string | null;
        };
        Relationships: GenericRelationship[];
      };
    };
    Functions: {
      toggle_habit_completion: {
        Args: {
          p_habit_id: string;
          p_date?: string;
          p_notes?: string | null;
        };
        Returns: boolean;
      };
      get_steps_forward: {
        Args: { p_user_id?: string };
        Returns: number;
      };
      get_habit_analytics: {
        Args: {
          p_habit_id: string;
          p_start_date?: string;
          p_end_date?: string;
        };
        Returns: {
          habit_id: string;
          start_date: string;
          end_date: string;
          scheduled_days: number;
          completed_days: number;
          completion_rate: number;
          current_streak: number;
          longest_streak: number;
        }[];
      };
      get_category_analytics: {
        Args: {
          p_category_id: string;
          p_start_date?: string;
          p_end_date?: string;
        };
        Returns: {
          category_id: string;
          category_name: string;
          category_type: CategoryType;
          habit_count: number;
          scheduled_days: number;
          completed_days: number;
          completion_rate: number;
          best_streak: number;
        }[];
      };
      get_rizen_metrics: {
        Args: {
          p_user_id?: string;
          p_start_date?: string;
          p_end_date?: string;
        };
        Returns: {
          completion_rate: number;
          current_streak: number;
          build_success_rate: number;
          quit_success_rate: number;
          growth_trend: number;
          steps_forward: number;
          longest_streak: number;
          favorite_habit_id: string | null;
          favorite_habit_name: string | null;
          strongest_category_id: string | null;
          strongest_category_name: string | null;
          needs_attention_category_id: string | null;
          needs_attention_category_name: string | null;
        }[];
      };
      get_rizen_score_trend: {
        Args: {
          p_user_id?: string;
          p_days?: number;
        };
        Returns: {
          score_date: string;
          completion_rate: number;
          current_streak: number;
          build_success_rate: number;
          quit_success_rate: number;
          growth_trend: number;
        }[];
      };
    };
    Enums: {
      habit_frequency: HabitFrequency;
      habit_type: HabitType;
      category_type: CategoryType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitLogInsert = Database["public"]["Tables"]["habit_logs"]["Insert"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];

export type HabitStreak = {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
};
