const { dateToString } = require("../../helpers/date");
const { transformBooking, user } = require("./merge");
const Booking = require("../../models/booking");
const User = require("../../models/user");
const Event = require("../../models/event");

module.exports = {
  bookings: async (args, req) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(async (booking) => {
        const event = await Event.findById(booking.event);

        if (!event) {
          throw new Error("Event not found for booking");
        }

        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
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
        createdAt: dateToString(result.createdAt),
        updatedAt: dateToString(result.updatedAt),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
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
