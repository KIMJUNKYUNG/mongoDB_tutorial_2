const addSum = (a, b) =>
    new Promise((resolve, reject) => {
        setTimeout(function () {
            if (typeof a !== 'number' || typeof b !== 'number') {
                reject('a, b must be numbers')
            }
            resolve(a + b)
        }, 3000)
    })

// addSum(10, 20)
//     .then((result) => {
//         console.log(result)
//         return addSum(result, 40)
//     }).then((result) => {
//         console.log(result)
//     })



const totalSum = async () => {
    try {
        let sum = await addSum(10, 10)
        console.log({ sum })
        let sum2 = await addSum(sum, "30")
        console.log({ sum2 })
    } catch (error) {
        if (error) console.log({ error })
    }
}

totalSum()