const mongoose = require('mongoose')
const { CommentSchema } = require('./Comment')

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: {
        _id: { type: mongoose.Types.ObjectId, required: true, ref: "user", index: true },
        userName: { type: String, required: true },
        name:
        {
            first: { type: String, required: true },
            last: { type: String, required: true }
        }
    },
    commentsCount: { type: Number, default: 0, required: true },
    comments: [CommentSchema]
    //    comments: [CommentSchema]
}, { timestamps: true }
)

BlogSchema.index({ 'user._id': 1, updateAt: 1 })

// // 가상의 스키마를 생성해서 관계형 데이터인 comment에 있는 DB를 긁어오는 코드
// // localField인 Blog의 _id와, comments들중에서 (foreignField)의 blogId 코드와 매칭되는 녀석들을 모두 긁어오는 것
// BlogSchema.virtual("comments", {
//     ref: "comment",
//     localField: "_id",
//     foreignField: "blogId"
// })

// BlogSchema.set("toObject", { virtuals: true })
// BlogSchema.set("toJSON", { virtuals: true })

const Blog = mongoose.model("blog", BlogSchema)
module.exports = { Blog }