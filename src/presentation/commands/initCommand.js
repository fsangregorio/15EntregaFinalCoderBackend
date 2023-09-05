
import { Command } from 'commander';
import CreateDefaultRolesCommand from './CreateDefaultRolesCommand.js';
import CreateDefaultAdminCommand from './CreateDefaultAdminCommand.js';

const initCommand = new Command('init');

initCommand.description("Start app").action(async (options) => {
  try {
    const roleArgs = ['--', 'create-default-roles'];

    await CreateDefaultRolesCommand.parseAsync(roleArgs);

    await CreateDefaultAdminCommand.parseAsync();

    console.log("Start complete");
    console.log('Admin user: admin@coder.com');
    console.log('Admin password: admin');
  } catch (error) {
    console.error("Start Error", error.message);
    console.log('Admin user: admin@coder.com');
    console.log('Admin password: admin');
  } finally {
    process.exit(0);
  }
});

export default initCommand;
