
import UserManager from './domain/managers/userManager.js';
import cron from 'node-cron';

const softDeleteInactiveUsers = async () => {
  const manager = new UserManager();
  try {
    const softDeleteInactiveUsers = await manager.softDeleteInactiveUsers();
    console.log("Users deleted successfully");
  } catch (error) {
    console.log("Error");
  }
};

export const every2DaysSoftDeleteUsers = cron.schedule('0 0 */2 * *', softDeleteInactiveUsers);
