const addsum = function (a, b, callback) {

    setTimeout(function () {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return callback('a and b must be number')
        }
        callback(undefined, a + b)
    }, 3000)
}

let callback = (error, sum) => {
    if (error) return console.log({ error })
    console.log({ sum })
}

addsum(10, "20", callback)