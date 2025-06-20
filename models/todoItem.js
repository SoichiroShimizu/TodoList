const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoItemSchema = new Schema({
    body: String,
    done: Boolean,
    deadLine: Date
});

module.exports = mongoose.model('TodoItem', todoItemSchema);