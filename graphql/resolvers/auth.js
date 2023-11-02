const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { dateToString } = require("../../helpers/date");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("user already exists");
      }
      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const create_user = new User({
        email: args.userInput.email,
        password: hashPassword,
      });
      const result = await create_user.save();
      return { ...result._doc, password: null, _id: result._id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user not found");
    }
    const isPassowrd = await bcrypt.compare(password, user.password);
    if (!isPassowrd) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, "somesupersecretkey", {
      expiresIn: "1h",
    });
    return { userId: user.id, user: user, token: token, tokenExpires: 1 };
  },
};
