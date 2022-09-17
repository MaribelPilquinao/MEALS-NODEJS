const express = require('express')

// routes

// Init Express
const app = express();

app.use(express.json());

// Endpoints


// Cath non-existing endpoints
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `${req.method} ${req.url} does not exists in our server`
    })
})

module.exports = {app}