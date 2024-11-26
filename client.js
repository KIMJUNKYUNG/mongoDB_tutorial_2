console.log('client code running')

const axios = require('axios')

const URI = "http://localhost:3000"

// blog count 20 ： 대략 6초    =》 populate 사용 후, 대략 1초  => nesting 한 후 0.5초 
// blog count 50 : 16초?

const test = async () => {

    console.time("loading time: ")

    const { data } = await axios.get(`${URI}/blog`)
    const blogs = data.blogs
    // const bindBlogs = await Promise.all(blogs.map(async (blog) => {
    //     const [res1, res2] = await Promise.all([
    //         axios.get(`${URI}/user/${blog.userId}`),
    //         axios.get(`${URI}/blog/${blog._id}/comment`)
    //     ])

    //     blog.user = res1.data.user
    //     blog.comments = await Promise.all(res2.data.comments.map(async (comment) => {
    //         const { data } = await axios.get(`${URI}/user/${comment.userId}`)
    //         comment.user = data.user
    //         return comment
    //     }))

    //     return blog
    // }))
    //console.dir(blogs[0], { depth: 10 })
    console.timeEnd("loading time: ")
}

const testGroup = async () => {
    await test()
    await test()
    await test()
    await test()
    await test()
}

testGroup()