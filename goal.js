const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const goalSchema = new Schema({
    waterGoal: {type: String, required: false},
    electricityGoal: {type: String, required: false},
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Goal', goalSchema);