const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds.map((id) => id.toString()) } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event._id.toString(),
      creator: user.bind(this, event.creator),
      date: new Date(event.date).toISOString(),
    };
  } catch (error) {}
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(async (booking) => {
        const event = await Event.findById(booking.event);

        if (!event) {
          throw new Error("Event not found for booking");
        }

        return {
          ...booking._doc,
          _id: booking._id.toString(),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString(),
          event: singleEvent(booking._doc.event),
          user: user(booking.user),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(event._doc.date()).toISOString(),
      creator: "6540752d59aaa34035362604",
    });
    let createEvent;
    try {
      const result_2 = await event.save();
      console.log(result_2);
      createEvent = { ...result_2._doc, creator: user.bind(this, result_2._doc.creator) };
      const created_user = await User.findById("6540752d59aaa34035362604");
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

  bookEvent: async (args) => {
    try {
      const fetchEvent = await Event.findOne({ _id: args.eventId });
      if (!fetchEvent) {
        throw new Error("Event not found");
      }

      const user = await User.findById("6540752d59aaa34035362604");
      if (!user) {
        throw new Error("User not found");
      }

      const booking = new Booking({
        user: user,
        event: fetchEvent,
      });

      const result = await booking.save();

      return {
        ...result._doc,
        _id: result._id.toString(),
        createdAt: new Date(result.createdAt).toISOString(),
        updatedAt: new Date(result.updatedAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");

      if (!booking) {
        throw new Error("Booking not found");
      }

      const event = booking.event;

      if (!event) {
        throw new Error("Event associated with the booking not found");
      }

      const eventData = {
        _id: event._id,
        title: event.title,
        creator: user(booking.user),
      };

      await Booking.deleteOne({ _id: args.bookingId });

      return eventData;
    } catch (error) {
      throw error;
    }
  },
};
