
import { createHash, isValidPassword } from "../../common/encrypt.js";
import { decodeToken, generateToken } from "../../common/jwt.js";
import { transporter } from "../../common/sendMail.js";

import emailValidation from "../validations/common/emailValidation.js";
import idValidation from "../validations/common/idValidation.js";
import userCreateValidation from "../validations/user/userCreateValidation.js";
import container from "../../container.js";

class SessionManager {
  constructor() {
    this.userRepository = new container.resolve("UserRepository");
  }

  async login(email, password) {
    await emailValidation.parseAsync({ email });
    const user = await this.userRepository.getUserByEmail(email);

    if (!user.email) throw new Error("User not found");
    const isPasswordCorrect = await isValidPassword(password, user.password);

    if (!isPasswordCorrect) throw new Error("Password incorrect");
    await this.userRepository.updateUser(user.id, { lastConnection: new Date() });
    return user;
  }

  async logout(userId) {
    await idValidation.parseAsync({ id: userId });
    await this.userRepository.updateUser(userId, { lastConnection: new Date() });
  }

  async signup(user) {
    await userCreateValidation.parseAsync(user);
    const encryptedPassword = await createHash(user.password);
    const newUser = {
      ...user,
      password: encryptedPassword,
    };
    return await this.userRepository.createUser(newUser);
  }

  async forgotPassword(email) {
    await emailValidation.parseAsync({ email });
    const user = await this.userRepository.getUserByEmail(email);

    if (!user.email) throw new Error("User not found");
    const token = await generateToken(user);

    const result = await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Password recovery link",
      html: `<a href=${process.env.FRONT_URL}/change-password?token=${token}>Reset password</a>
      
      <p><b>Token: </b><code>${token}</code></p>
      `,
    });

    if (!result) throw new Error("Error");
    return result;
  }

  async changePassword(token, passwords) {
    const { user } = await decodeToken(token);

    const { id, password } = await this.userRepository.getUserByEmail(user.email);
    if (passwords.password !== passwords.passwordToConfirm) {
      throw new Error("Error");
    }

    if (isSamePassword) throw new Error("Please, choose a different password");

    const encryptedPassword = await createHash(passwords.password);

    const result = await this.userRepository.updateUser(id, {
      password: encryptedPassword,
    });

    if (!result) throw new Error("Error");
    return result;
  }
}

export default SessionManager;
