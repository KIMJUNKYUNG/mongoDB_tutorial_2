const { Router } = require('express')
const commentRouter = Router({ mergeParams: true })


const { Comment } = require('../models/Comment')
const { Blog } = require('../models/Blog')
const { User } = require('../models/User')

const { isValidObjectId, startSession } = require('mongoose')

commentRouter.post('/', async (req, res) => {
    const session = await startSession()
    try {
        let comment
        await session.withTransaction(async () => {
            const { blogId } = req.params
            const { content, userId } = req.body

            var reg = new RegExp("[0-9a-fA-F]{24}")

            if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invalid" })
            if (!isValidObjectId(userId)) return res.status(400).send({ error: "userId is invalid" })
            if (typeof content !== 'string') return res.status(400).send({ error: "content must be string" })


            if (!reg.test(userId)) return res.status(400).send({ error: "userId Error" })

            //const blog = await Blog.findById({ _id: blogId })
            //const user = await User.findById({ _id: userId })
            const [blog, user] = await Promise.all([
                Blog.findById(blogId, {}, { session }),
                User.findById(userId, {}, { session })
            ])

            if (!blog || !user) return res.status(400).send({ error: "blog or user is not existed" })

            if (!blog.isLive) return res.status(400).send({ error: "blog is not on live" })
            comment = new Comment({
                content,
                userId,
                userFullName: `${user.name.first} ${user.name.last}`,
                blogId
            })

            // await Blog.updateOne({_id : blogId}, {$push : {comments : comment}}) // Blog에도 comment 정보 추가하기

            // await Promise.all([
            //     comment.save(),
            //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
            // ])

            blog.commentsCount += 1     // 동시에 누군가가 글을 쓰면 맛탱이 감
            //console.log(comment)
            blog.comments.push(comment)
            if (blog.commentsCount > 3) blog.comments.shift()

            await Promise.all([
                comment.save({ session }),
                blog.save()                 // 이미 blog는 session을 먹인 상태여서 굳이 안주어도됨
                //Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } })
            ])
        })
        return res.send({ comment })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    } finally {
        await session.endSession()
    }
})

commentRouter.get('/', async (req, res) => {
    let { page = 0 } = req.query
    page = parseInt(page)
    const { blogId } = req.params
    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invalid" })

    const comments = await Comment.find({ blogId: blogId })
        .sort({ createAt: -1 })
        .skip(page * 3)
        .limit(3)

    return res.send({ comments })
})

commentRouter.patch('/:commentId', async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (typeof content !== 'string') return res.send(400).send({ error: "content is not string" })

    const [comment] = await Promise.all([
        Comment.findOneAndUpdate({ _id: commentId }, { content: content }, { new: true }),
        Blog.updateOne({ "comments._id": commentId }, { "comments.$.content": content })
    ])
    return res.send({ comment })
})

commentRouter.delete('/:commentId', async (req, res) => {
    console.log("Hello World")
    const { commentId } = req.params
    const comment = await Comment.findOneAndDelete({ _id: commentId })

    await Blog.updateOne(
        { "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } }
    )
    return res.send({ comment })
})

module.exports = { commentRouter }