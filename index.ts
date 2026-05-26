import { program } from "commander";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { execa } from "execa";

type StorageItem = {
  name: string;
  key: string;
};

const storage = createStorage<Record<string, StorageItem>>({
  driver: fsDriver({ base: "./.data" }),
});

const checkUserAndGetID = async (name?: string) => {
  const keys = await storage.getKeys();
  if (keys.length == 0) return "1";
  if (name) {
    for (const key of keys) {
      const itemName = (await storage.getItem(key))?.name;
      if (itemName == name) {
        return null;
      }
    }
  }
  return (keys.length + 1).toString();
};

// program.name("codex-auth").description("");
program
  .command("add")
  .description("Add a new user profile")
  .argument("<key>", "The api key to be added.")
  .option("-n, --name <name>")
  .action(async (key: string, options: { name: string }) => {
    const id = await checkUserAndGetID(options.name);
    if (id == null) {
      program.error(
        "A user profile with the same name exists. Choose a different name.",
      );
    }
    await storage.setItem(id, { name: options.name, key });
    console.log("User profile added.");
  });
program
  .command("remove")
  .description("Remove a user profile")
  .argument("<identifier>", "Identifier of the user profile to be removed.")
  .action((identifier: string) => {
    console.log(identifier);
  });
program
  .command("switch")
  .description("Switch to the user profile with the given identifier.")
  .argument("<identifier>", "Identifier of the user profile to be switched to.")
  .action(async (identifier: string) => {
    const record = await storage.getItem(identifier);
    if (record) {
      const key = record.key;
      try {
        // const { stdout } = await execa("echo", [key]).pipe("codex", [
        //   "login",
        //   "--with-api-key",
        // ]);
        console.log(key);
        const { stdout } = await execa`echo ${key}`
          .pipe`codex login --with-api-key`;
        console.log(stdout);
      } catch (error) {
        console.log("Command failed: ", error);
      }
    }
  });
program
  .command("list")
  .description("List all available user profiles.")
  .action(async () => {
    const keys = await storage.getKeys();
    keys.forEach(async (key) => {
      const item = await storage.getItem(key);
      console.log(`${key} -- ${item?.name}`);
    });
  });

program.parse(Bun.argv);
