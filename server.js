const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
console.log('Listening on 8888')
app.listen(8888);
