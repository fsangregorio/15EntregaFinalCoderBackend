
import dotenv from "dotenv";
dotenv.config();

import AppFactory from "./presentation/factories/appFactory.js";
import DbFactory from "./data/factories/dbFactory.js";
import { every2DaysSoftDeleteUsers } from './cronJobs.js';

void (async () => {
  const db = await DbFactory.create(process.env.DB);
  db.init(process.env.DB_URI);

  const app = await AppFactory.create();
  app.init();
  app.build();
  app.listen();
  every2DaysSoftDeleteUsers;
})();
