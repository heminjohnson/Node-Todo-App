var mongoose = require('mongoose')

mongoose.promise = global.promise
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

module.exports = {mongoose}