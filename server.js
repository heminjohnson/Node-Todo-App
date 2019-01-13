require('./config/config')

var express = require('express')
var bodyParser = require('body-parser')
var {ObjectID} = require('mongodb')
var _ = require('ramda')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {authenticate} = require('./middleware/authenticate')

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }

    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndDelete(id).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }

    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(['text', 'completed'], req.body)

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if(body.completed === true) {
    body.completedAt = new Date().getTime()
  } else {
    body.completedAt = null
    body.completed = false
  }

  Todo.findByIdAndUpdate({_id: id}, body, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }

    res.send({todo})
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.post('/users', (req, res) => {
  var body = _.pick(['email', 'password'], req.body)
  var user = new User(body)

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {app}