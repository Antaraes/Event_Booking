const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { user, transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date).toISOString(),
      creator: "6541cb93a43749a935edc14a",
    });
    let createEvent;
    try {
      const result_2 = await event.save();
      console.log(result_2);
      createEvent = transformEvent(result_2);
      const created_user = await User.findById("6541cb93a43749a935edc14a");
      if (!created_user) {
        throw new Error("user not found");
      }
      created_user.createdEvents.push(event);
      await created_user.save();
      return createEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
