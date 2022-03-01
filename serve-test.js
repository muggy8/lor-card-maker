const express = require('express')
const app = express()
const port = 1337

app.use(express.static('docs'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/`)
})
