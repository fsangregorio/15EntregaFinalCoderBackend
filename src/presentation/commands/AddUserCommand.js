
import { Command } from 'commander';
import UserManager from '../../domain/managers/userManager.js';

const AddUserCommand = new Command('add-user');

AddUserCommand.version('1.0.0')
  .description('Add a new user')
  .option('-e, --email <email>', 'User email')
  .option('-p, --password <password>', 'User password')
  .option('-fn, --firstName <firstName>', 'User firstname')
  .option('-ln, --lastName <lastName>', 'User lastname')
  .option('-a, --age <age>', 'User age')
  .option('-ia, --isAdmin <isAdmin>', 'User isAdmin')
  .action(async (options) => {
    const payload = {
      ...options,
      age: +options.age,
      isAdmin: options.isAdmin === 'true',
    };
    const manager = new UserManager();
    const user = await manager.createUser(payload);
    if (user) console.log("User created");
  });

export default AddUserCommand;
