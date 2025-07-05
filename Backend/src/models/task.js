const mongoose = require('mongoose');
const { Schema } = mongoose;
const taskSchema=new Schema({
    
})

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
