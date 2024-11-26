const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },   //unique 를 추가하면 indexes 목록에 추가된다. 유일해짐
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    age: { type: Number, index: true },
    email: String
}, { timestamps: true })

const User = mongoose.model('user', UserSchema)     // 첫번재 인자가 document 위치
module.exports = { User }