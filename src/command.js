
import { exit } from 'shelljs';
import { program } from 'commander';
import AddUserCommand from './presentation/commands/AddUserCommand.js';
import CreateDefaultRolesCommand from './presentation/commands/CreateDefaultRolesCommand.js';
import CreateDefaultAdminCommand from './presentation/commands/CreateDefaultAdminCommand.js';
import DbFactory from './data/factories/dbFactory.js';
import dotenv from 'dotenv';
import initCommand from './presentation/commands/initCommand.js';
dotenv.config();

void (async () => {
  {
    try {
      const db = await DbFactory.create(process.env.DB);
      db.init(process.env.DB_URI);

      program
        .addCommand(CreateDefaultRolesCommand)
        .addCommand(AddUserCommand)
        .addCommand(CreateDefaultAdminCommand)
        .addCommand(initCommand);

      await program.parseAsync(process.argv);

      await db.close();
    } catch (error) {
      console.error('Error:', error.message);
      exit();
    } finally {
      exit();
    }
  }
})();
