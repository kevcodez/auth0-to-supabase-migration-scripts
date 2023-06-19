import { Empty, IdentityData, IdentityEntry, Metadata, SupabaseProvider, UsersEntry } from '../typedef';
import { Auth0User } from './migration-typedef';

function getProviderFromAuth0(user: Auth0User): SupabaseProvider {
  const provider = user.identities[0]?.provider;
  if (provider.startsWith('google')) return 'google' as SupabaseProvider;
  else if (provider.startsWith('auth0')) return 'email' as SupabaseProvider;
  else return provider as SupabaseProvider;
}

function getSubFromAuth0(user: Auth0User): string {
  return user.user_id.split('|')[1];
}

export function mapAuth0ToIdentity(user: Auth0User, supabaseUserId: string): IdentityEntry {
  const provider = getProviderFromAuth0(user);
  const sub = getSubFromAuth0(user);

  return {
    user_id: supabaseUserId,
    id: sub,
    provider,
    last_sign_in_at: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at,
    identity_data: getIdentityDataFromAuth0User(user),
  };
}

export function mapAuth0ToSupabase(user: Auth0User, passwordHash?: string): UsersEntry {
  const provider = getProviderFromAuth0(user);
  const sub = getSubFromAuth0(user);

  const usersEntry: UsersEntry = {
    instance_id: '00000000-0000-0000-0000-000000000000',
    aud: 'authenticated',
    role: 'authenticated',
    email: user.email,
    raw_user_meta_data: getIdentityDataFromAuth0User(user),
    raw_app_meta_data: {
      provider,
      providers: [provider],
    },
    is_super_admin: false,
    last_sign_in_at: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at,
    email_confirmed_at: user.created_at,
    encrypted_password: passwordHash || empty(),
    confirmation_token: empty(),
    recovery_token: empty(),
    email_change_token_new: empty(),
    email_change: empty(),
    phone_change: empty(),
    phone_change_token: empty(),
    email_change_token_current: empty(),
    email_change_confirm_status: 0,
  };

  if (provider == 'email') {
    (usersEntry.raw_app_meta_data as Metadata).parqetUserId = sub;
  }

  return usersEntry;
}

function getIdentityDataFromAuth0User(user: Auth0User): IdentityData {
  const sub = user.user_id.split('|')[1];
  const provider = getProviderFromAuth0(user);

  if (provider == 'email') {
    return { sub };
  } else {
    return {
      sub,
      email: user.email,
      picture: user.picture,
      full_name: user.name,
      name: user.name,
      provider_id: sub,
      email_verified: user.email_verified,
      avatar_url: user.picture,
      iss: getIssuer(provider),
    };
  }
}

function getIssuer(provider: SupabaseProvider): string {
  switch (provider) {
    case 'google':
      return 'https://www.googleapis.com/userinfo/v2/me';
    case 'facebook':
      return 'https://graph.facebook.com/me?fields=email,first_name,last_name,name,picture';
    case 'apple':
      return 'https://appleid.apple.com/auth/keys';
    default:
      throw new Error('Unknown provider :' + provider);
  }
}

function empty(): Empty {
  return '';
}