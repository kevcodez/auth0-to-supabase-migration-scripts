import { Provider } from '@supabase/supabase-js';

export type SupabaseProvider = Provider | 'email';

export interface IdentityEntry {
  user_id: UserId; // linked with UsersEntry.id
  id: ProviderId;
  provider: SupabaseProvider;
  last_sign_in_at: IsoString;
  created_at: IsoString;
  updated_at: IsoString;
  identity_data: IdentityData;
}

export type IdentityData =
  | {
      iss: string;
      sub: ProviderId;
      name: string;
      email: Email;
      picture: string;
      full_name: string;
      avatar_url: string;
      provider_id: ProviderId;
      email_verified: boolean;
    }
  | { sub: ProviderId };

export interface Metadata {
  provider: SupabaseProvider;
  providers: SupabaseProvider[];
  parqetUserId?: string;
}

export interface UsersEntry {
  instance_id: string;
  id?: UserId; // created on insert by postgres
  aud: 'authenticated';
  role: 'authenticated';
  email: Email;
  raw_user_meta_data: IdentityData;
  raw_app_meta_data: Metadata;
  is_super_admin: boolean;
  last_sign_in_at: IsoString;
  created_at: IsoString;
  updated_at: IsoString;
  email_confirmed_at: IsoString;
  encrypted_password: string | Empty;
  confirmation_token: Empty;
  recovery_token: Empty;
  email_change_token_new: Empty;
  email_change: Empty;
  phone_change: Empty;
  phone_change_token: Empty;
  email_change_token_current: Empty;
  phone_confirmed_at?: Empty;
  phone_change_sent_at?: Empty;
  phone?: Empty;
  email_change_confirm_status: 0;
  banned_until?: Empty;
  recovery_sent_at?: IsoString;
  invited_at?: Empty;
  email_change_sent_at?: Empty;
  confirmation_sent_at?: Empty;
  confirmed_at?: IsoString;
}

type IsoString = string;
export type Empty = '';
type UserId = string;
type ProviderId = string;
type Email = string;
