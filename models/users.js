const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,   // Use Date (with a capital D) as the type
        default: Date.now,  // Default to the current date and time
    },
});

module.exports = mongoose.model('users', userSchema);
