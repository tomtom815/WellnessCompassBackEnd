const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    height: [Object],
    BMI: [Object], //this can be calculated by height and weight so maybe user doesn't have to be prompted to put it in?
    //and we can do it for them?  
    //TH: Agreed, formula is 703 X height(inches)/weight(lbs)^2 ie for me 703 * (165/67^2) = BMI 25.8
    steps: [Object],
    activeMinutes: [Object],
    dailyMeals: [Object],
    healthGoals: [Object],
    //val note: i have a function i used in a previous project that can add new member variables to all users,
    //so if we want to add more variables, we can just use that //fingerguns
    userConsent: {
        type: Boolean,
        default: false
    },
    userAge: [Number],
    userGender: {
        Type: String,
        
    }
});

module.exports = mongoose.model('User', userSchema);