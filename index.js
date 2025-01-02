const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    "id": 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(morgan('tiny'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404)
    response.send('Resorce not found')
    response.end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const repeteadPerson = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
  if (repeteadPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>
    `)
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)
//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404)
//     response.send('Resorce not found')
//     response.end()
//   }
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }

//   const note = {
//     content: body.content,
//     important: Boolean(body.important) || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})