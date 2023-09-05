
import { Command } from 'commander';
import RoleManager from '../../domain/managers/roleManager.js';

const CreateDefaultRolesCommand = new Command('create-default-roles')
  .description("Create default roles")
  .action(async () => {
    try {
      const manager = new RoleManager();
      const clientRole = {
        name: 'client',
        permissions: ['readUsers', 'readRoles'],
      };
      const premiumRole = {
        name: 'premium',
        permissions: ['readUsers', 'readRoles', 'createProduct', 'updateProduct', 'deleteProduct'],
      };
      await manager.createRole(clientRole);
      await manager.createRole(premiumRole);

      console.log('Roles created');
    } catch (error) {
      console.error("Error", error.message);
    }
  });

export default CreateDefaultRolesCommand;
