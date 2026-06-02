export type UserRole = 'admin' | 'teacher' | 'coordinator';
export type OccurrenceType =
  | 'Disciplinar'
  | 'Pedagógica'
  | 'Saúde'
  | 'Infrequência'
  | 'Outro';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Occurrence {
  id: string;
  user_id: string;
  aluno: string;
  data: string;
  tipo: OccurrenceType;
  descricao: string;
  encaminhamento: string | null;
  created_at: string;
  updated_at: string;
}

export interface OccurrenceWithAuthor extends Occurrence {
  profiles: {
    full_name: string;
  } | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      occurrences: {
        Row: Occurrence;
        Insert: Omit<Occurrence, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Occurrence, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}
