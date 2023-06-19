import { Provider } from '@supabase/supabase-js';

type Auth0Provider = Provider | 'google-oauth2' | 'auth0';

export interface Auth0User {
  email: Email;
  user_id: `${Auth0Provider}|${ProviderId}`;
  email_verified: boolean;
  identities: [
    {
      provider: Auth0Provider;
      user_id: ProviderId;
    },
  ];
  name: string;
  picture: string;
  last_login: IsoString;
  created_at: IsoString;
  updated_at: IsoString;
}

type IsoString = string;
type ProviderId = string;
type Email = string;