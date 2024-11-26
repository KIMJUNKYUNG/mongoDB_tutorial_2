const { Router } = require('express')
const blogRouter = Router()

const { Blog } = require('../models/Blog')
const { User } = require('../models/User')

const mongoose = require('mongoose')


blogRouter.post('/', async (req, res) => {
    try {
        const { title, content, isLive, userId } = req.body

        if (typeof title !== 'string') return res.status(400).send({ error: "Title is required" })
        if (typeof content !== 'string') return res.status(400).send({ error: "Content must be String" })
        if (isLive && typeof isLive !== 'boolean') return res.status(400).send({ error: "isLive must be Boolean" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ error: "userId is Invalid" })

        let user = await User.findById(userId)
        if (!user) res.status(400).send({ error: "user is not exist" })

        //let blog = new Blog({ title, content, isLive, userId, user })
        let blog = new Blog({ ...req.body, user })
        await blog.save()

        return res.send(blog)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})

blogRouter.get('/', async (req, res) => {
    try {
        let { page = 0 } = req.query
        page = parseInt(page)
        // console.log({ page })
        const blogs = await Blog.find()
            .sort({ updateAt: -1 })
            .skip(page * 3)
            .limit(3)
        //    .populate(['userId', { path: "comments", populate: { path: "userId" } }])             // 핵심 코드, 시간을 줄이기 위해서

        return res.send({ blogs })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})

blogRouter.get('/:blogId([0-9a-fA-F]{24})', async (req, res) => {
    try {
        const { blogId } = req.params       // Url 파라미터 긁어오는 방식

        if (!mongoose.isValidObjectId(blogId))
            return res.status(400).send({ error: "userId is Invalid" })

        const blog = await Blog.findOne({ _id: blogId })
        //const commentCount = await Comment.find({blogId : blogId}).countDocuments();

        return res.send({ blog })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})

blogRouter.put('/:blogId([0-9a-fA-F]{24})', async (req, res) => {
    try {
        const { title, content } = req.body
        const { blogId } = req.params       // Url 파라미터 긁어오는 방식

        if (typeof title !== 'string') return res.status(400).send({ error: "Title is required" })
        if (typeof content !== 'string') return res.status(400).send({ error: "Content must be String" })

        const blog = await Blog.findOneAndUpdate({ _id: blogId }, { title, content }, { new: true })
        return res.send({ blog })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})

blogRouter.patch('/:blogId([0-9a-fA-F]{24})/isLive', async (req, res) => {       // 부분 수정
    try {
        const { blogId } = req.params       // Url 파라미터 긁어오는 방식
        if (!mongoose.isValidObjectId(blogId))
            return res.status(400).send({ error: "userId is Invalid" })

        const { isLive } = req.body
        if (typeof isLive !== 'boolean') return res.status(400).send({ error: "isLive is must be boolean" })

        const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { isLive }, { new: true })
        return res.send({ blog })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})



module.exports = { blogRouter }