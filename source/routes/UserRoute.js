const { Router } = require('express')
const userRouter = Router()
const mongoose = require('mongoose')        // npm mongoose 불러오기 -> mongoDB를 좀더 편하게 사용하기 위한 툴

const { User } = require('../models/User')   // Model Schema 형태 및, document 고르기 
const { Blog } = require('../models/Blog')
const { Comment } = require('../models/Comment')

userRouter.get('/', async (req, res) => {      // User 전체 받아오기
    try {
        const users = await User.find({})
        // console.log(`hello${users}`)
        return res.send({ users: users })
    } catch (error) {
        console.log({ error })
        return res.status(500).send({ error: error.message })
    }
})
5
userRouter.get('/:userId', async (req, res) => {      // User 하나만 _id : :userId 기준으로 받아오기
    try {
        const { userId } = req.params
        //console.log(userId)
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ error: "Invalid User Id" })
        }
        const user = await User.findOne({ _id: userId })
        return res.send({ user })
    } catch (error) {
        console.log({ error })
        return res.status(500).send({ error: error.message })
    }
})

userRouter.delete('/:userId', async (req, res) => {      // User 하나만 _id : :userId 기준으로 받아오기
    try {
        const { userId } = req.params
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ error: "Invalid User Id" })
        }

        const [user] = await Promise.all([
            User.deleteOne({ _id: userId }),
            Blog.deleteMany(
                { "user._id": userId }
            ), Blog.updateMany(
                { "comments.userId": userId },
                { $pull: { comments: { userId: userId } } }
            ), Comment.deleteMany(
                { userId: userId }
            )
        ])
        return res.send({ user })
    } catch (error) {
        console.log({ error })
        return res.status(500).send({ error: error.message })
    }
})

userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ error: "Invalid User Id" })
        }
        const { age, name } = req.body
        if (!age || !name) return res.status(400).send({ error: " age or name is required" })
        if (age && typeof age !== 'number') return res.status(400).send({ error: "age must be number" })
        if (name && typeof name.first !== 'string' || typeof name.last !== 'string') return res.status(400).send({ error: "first and last name must be string" })

        //const user = await User.findByIdAndUpdate(userId, { age, name }, { new: true }) // new true option을 활성화 해주어야 업데이트 이후 데이터가 리턴된다. 

        let user = await User.findById(userId)
        if (age) user.age = age
        if (name) {
            user.name = name
            await Promise.all([
                Blog.updateMany({ "user._id": userId }, { "user.name": name }),
                Blog.updateMany(
                    {},
                    { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
                    { arrayFilters: [{ "comment.userId": userId }] }
                )
            ])
        }
        await user.save()

        return res.send({ user })
    } catch (error) {
        console.log({ error })
        return res.status(500).send({ error: error.message })
    }
})

userRouter.post('/', async (req, res) => {     // post     // User 추가하기
    try {
        let { userName, name } = req.body       // req.body 에서 userName, name JSON만 골라올 수 있음
        if (!userName)
            return res.status(400).send({ error: "userName is require" })
        if (!name || !name.first || !name.last)
            return res.status(400).send({ error: "Both first name and last name is required" })

        const user = new User(req.body);
        await user.save();                  // Mongose Method
        return res.send(user)
    } catch (error) {
        console.log({ error })
        return res.status(500).send({ error: error.message })
    }

})

module.exports = { userRouter }