import 'dotenv/config';
import { supabaseDbService } from './supabase/db/supabaseDbService';
import { readLinesOfFile, writeStream } from './fsHelpers';
import { Auth0User } from './supabase/db/migration/migration-typedef';

const SOURCE_FILE_PATH = '../tresor-dev-full.json';
const PW_FILE_PATH = '../tresor_dev_pws.json';
const USERS_WITHOUT_PW_FILE_PATH = './usersWithoutPw';

const users = readLinesOfFile(SOURCE_FILE_PATH).map((it) => JSON.parse(it)) as Auth0User[];

type PwMatch = {
  passwordHash: string;
  _id: { $oid: string };
};

const passwords = readLinesOfFile(PW_FILE_PATH).map((it) => JSON.parse(it)) as PwMatch[];

const pwUsers = users.filter((u) => u.identities[0].provider == 'auth0');

const writeToFile = writeStream(USERS_WITHOUT_PW_FILE_PATH);

(async () => {
  for (let i = 0; i < pwUsers.length; i++) {
    const user = pwUsers[i];
    const pwMatch = passwords.find((pw) => pw._id.$oid == user.user_id.split('|')[1]);

    if (!pwMatch) {
      await writeToFile(JSON.stringify(user));
      continue;
    }

    const result = await supabaseDbService.migrateAuth0User(user, pwMatch.passwordHash);

    console.log(`${result} => ${user.email} (${i + 1} / ${pwUsers.length})`);
  }
  process.exit(1);
})();