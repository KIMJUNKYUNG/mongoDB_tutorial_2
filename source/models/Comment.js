const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "user", index: true },
    userFullName: { type: String, required: true },
    blogId: { type: mongoose.Types.ObjectId, required: true, ref: "blog" }
}, { timestamps: true })

CommentSchema.index({ blogId: 1, createdAt: -1 })

const Comment = mongoose.model('comment', CommentSchema)

module.exports = { Comment, CommentSchema }