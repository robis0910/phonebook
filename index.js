const express = require('express')
const app = express()

//creates js objects from json data in response body
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//gets
app.get('/api/persons', (request, response) => {
    if (persons) {
        response.json(persons)
    } else {
        response.status(404).end()
    }
})
app.get('/info', (request, response) => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();   
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${date} ${time} ${timeZone}</div>`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//deletes
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

//posts
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || body.name.trim() === "") {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }

    if (persons.some(p => p.name === body.name.trim())) {
        return response.status(400).json({ 
            error: 'duplicate entry' 
        })
    }

    if (!body.number || body.number.trim() === "") {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const person = {
      content: body.name.trim(),
      important: body.number.trim(),
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

//helpers
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id)))
      : 0
    return String(maxId + 1)
}

//start
const PORT = 3001 || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})