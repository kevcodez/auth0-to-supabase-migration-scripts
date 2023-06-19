import "dotenv/config";
import { supabaseDbService } from "./supabase/db/supabaseDbService";
import { readLinesOfFile } from "./fsHelpers";
import { Auth0User } from "./supabase/db/migration/migration-typedef";

// Based on the user export from the Auth0 marketplace plugin to export users (free)
const SOURCE_FILE_PATH = "../tresor-dev-full.json";

const users = readLinesOfFile(SOURCE_FILE_PATH).map((it) =>
  JSON.parse(it)
) as Auth0User[];

const socialUsers = users.filter((u) => u.identities[0].provider != "auth0");

(async () => {
  for (let i = 0; i < socialUsers.length; i++) {
    const user = socialUsers[i];

    const result = await supabaseDbService.migrateAuth0User(user);

    console.log(
      `${result} => ${user.email} (${i + 1} / ${socialUsers.length})`
    );
  }
  process.exit(1);
})();
