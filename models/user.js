const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    todolist:[
        {
            type: Schema.Types.ObjectId,
            ref: 'todo'
        }
    ]
})