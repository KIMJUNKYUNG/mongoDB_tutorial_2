const express = require('express')  // npm express 불러오기
const app = express()               // 기본 코드 

const mongoose = require('mongoose')        // npm mongoose 불러오기 -> mongoDB를 좀더 편하게 사용하기 위한 툴

const { userRouter } = require('./routes/UserRoute')
const { blogRouter } = require('./routes/BlogRoute')
const { commentRouter } = require('./routes/CommentRoute')

//const { generateFakeData } = require('../faker')
const { generateFakeData } = require('../faker2')

const server = async () => {    // async함수 형태로 형성하기
    try {   // async를 쓸땐 try-catch를 사용하는 것이 정석
        const { MONGO_URI } = process.env

        if (!MONGO_URI) throw new Error('MONGO_URI is required')
        await mongoose.connect(MONGO_URI)       // server를 열기전에 DB 연결을 기다리기
        //mongoose.set('debug', true)             // mongoose의 실제 쿼리들을 확인 가능
        console.log('MongoDB connected')

        app.use(express.json())                // express Parser를 사용하기 위한 코드

        app.use('/user', userRouter)
        app.use('/blog', blogRouter)
        app.use('/blog/:blogId([0-9a-fA-F]{24})/comment', commentRouter)

        app.listen(3000, async function () {              // Server ON
            console.log('server listening on port 3000')
            // for (let i = 0; i < 20; i++) {
            //await generateFakeData(10, 2, 10)
            // }
        })
    } catch (error) {
        console.log({ error })
    }
}

server()
