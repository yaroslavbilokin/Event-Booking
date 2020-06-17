const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const { user } = require('./merge');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5ee9b38a0e752dbb569b5d83"
        });
        let createdEvent;
        try {
            const result = await event
                .save()
            createdEvent = transformEvent(result);
            const creator = await User.findById("5ee9b38a0e752dbb569b5d83");
            if (!creator) {
                throw new Error('User not found.')
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
}