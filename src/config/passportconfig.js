
import passport from "passport";
import local from "passport-local";
import UserManager from "../domain/managers/userManager.js";
import GithubStrategy from "passport-github2";
import { createHash } from "../common/encrypt.js";
import dotenv from "dotenv";


dotenv.config();

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } =
  process.env;
const credentials = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL,
};
const LocalStragegy = local.Strategy;

const signup = new LocalStragegy(
  {
    passReqToCallback: true,
    usernameField: "email",
  },
  async (req, username, password, done) => {
    try {
      const manager = new UserManager();
      let user = await manager.getUserByEmail(req.body.email);

      if (user.id) {
        console.log("User already exists.");
        return done(null, false);
      }

      const newUser = {
        ...req.body,
        password: await createHash(req.body.password),
      };

      let result = await manager.createUser(newUser);
      return done(null, result);
    }
    catch (error) {
      console.log(error);
      done("Signup error");
    }
  }
);

const login = new LocalStragegy(
  {
    passReqToCallback: true,
    usernameField: "email",
  },
  async (req, email, password, done) => {
    try {
      const manager = new UserManager();
      let user = await manager.getUserByEmail(req.body.email);

      if (!user.id) {
        console.log("User does not exist.");
        return done(null, false);
      }

      if (!(await isValidPassword(req.body.password, user.password))) {
        console.log("Invalid password.");
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      done("Login failed");
    }
  }
);

const github = new GithubStrategy(
  credentials,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const manager = new UserManager();
      let user = await manager.getUserByEmail(profile._json.email);

      if (user.id) {
        return done(null, user);
      }
      const newUser = {
        email: profile._json.email,
        password: "",
      };
      let result = await manager.createUser(newUser);

      return done(null, result);
    } catch (error) {
      done("Login failed" + error);
    }
  }
);

const initPassport = () => {
  passport.use("singupPassport", signup);
  passport.use("loginPassport", login);
  passport.use("github", github);
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const manager = new UserManager();
    let user = await manager.getUserById(id);
    done(null, user);
  });
};

export default initPassport;
