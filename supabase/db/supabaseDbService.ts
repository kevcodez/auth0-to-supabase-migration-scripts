import { dbClient } from './dbClient';
import { Auth0User } from './migration/migration-typedef';
import { mapAuth0ToIdentity, mapAuth0ToSupabase } from './migration/migrationHelpers';
import { getValuesFromKeys } from './supabaseDbHelpers';

function getConnection() {
  return dbClient().then((c) => c);
}

async function query<T>(q: string): Promise<T> {
  const client = await getConnection();
  return client.query(q).then((r) => r.rows) as T;
}

async function insertAuth0User(user: Auth0User, password?: string): Promise<string> {
  const supabaseUser = mapAuth0ToSupabase(user, password);
  const keys = Object.keys(supabaseUser).filter((k) => !!supabaseUser[k]);

  const q = `
    INSERT INTO auth.users (${keys.join(',')})
    VALUES (${getValuesFromKeys(keys, supabaseUser).join(',')})
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  return query(q).then((rows) => rows[0]?.id);
}

async function insertAuth0Identity(user: Auth0User, id: string): Promise<'ok'> {
  const supabaseIdentity = mapAuth0ToIdentity(user, id);
  const keys = Object.keys(supabaseIdentity).filter((k) => !!supabaseIdentity[k]);

  return query(
    `
    INSERT INTO auth.identities (${keys.join(',')})
    VALUES (${getValuesFromKeys(keys, supabaseIdentity).join(',')});
  `,
  ).then(() => 'ok');
}

async function migrateAuth0User<T extends Auth0User>(user: T, password?: string): Promise<'ok' | 'already exists'> {
  return insertAuth0User(user, password).then((id) => (id ? insertAuth0Identity(user, id) : 'already exists'));
}

export const supabaseDbService = {
  query,
  migrateAuth0User,
};
