const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { dateToString } = require("../../helpers/date");

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
};
