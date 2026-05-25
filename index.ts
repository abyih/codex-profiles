import { $, sql } from "bun";
import { program } from "commander";

// const program = new Command();

// program.name("codex-auth").description("");
() => {};
program
  .command("add")
  .description("Add a new user profile")
  .argument("<key>", "The api key to be added.")
  .action((key: string) => {
    console.log(key);
  })
  .command("remove")
  .description("Remove a user profile")
  .argument("<identifier>", "Identifier of the user profile to be removed.")
  .action((identifier: string) => {
    console.log(identifier);
  })
  .command("switch")
  .description("Switch to the user profile with the given identifier.")
  .argument("<identifier>", "Identifier of the user profile to be switched to.")
  .action((identifier: string) => {
    console.log(identifier);
  });

program.parse(Bun.argv);
