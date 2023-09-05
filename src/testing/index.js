
import dotenv from "dotenv";
import AppFactory from "../presentation/factories/appFactory.js";
import DbFactory from "../data/factories/dbFactory.js";

dotenv.config();

const initServer = async () => {
  const db = DbFactory.create(process.env.DB);
  db.init(process.env.DB_URI_TEST);

  const app = AppFactory.create();

  app.init();
  app.build();

  return {
    app,
    db,
  };
};

export default initServer;
