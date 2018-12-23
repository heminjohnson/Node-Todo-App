var mongoose = require('mongoose')

mongoose.promise = global.promise
mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost:27017/todoApp', { useNewUrlParser: true })

module.exports = {mongoose}