const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    weight: [Object],
    BMI: [Object],
    steps: [Object],
    activeMinutes: [Object],
    dailyMeals: [Object],
    healthGoals: [Object]
});

module.exports = mongoose.model('User', userSchema);