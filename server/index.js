const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const fs = require('fs')
const path = require('path')


const PORT = 1000

app.use(cors())
app.use(express.json())


app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json("Image wrote")
    } catch (e) {
        console.log(e)
        return res.status(500).json("Image error")
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json("Image error")
    }
})


app.ws('/', (ws, req) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        switch (message.method) {
            case "connection":
                connectionHandler(ws, message)
                break
            case "draw":
                broadcastConnection(ws, message)
                break
            case "undoList":
                broadcastConnection(ws, message)
                break
            case "undo":
                broadcastConnection(ws, message)
                break
            case "redo":
                broadcastConnection(ws, message)
                break
        }
    })
})

const connectionHandler = (ws, message) => {
    ws.id = message.id
    broadcastConnection(ws, message)
}

const broadcastConnection = (ws, message) => {
    aWss.clients.forEach(client => {
        if(client.id === message.id) {
            client.send(JSON.stringify(message))
        }
    })
}


app.listen(PORT, () => console.log("Server started"))