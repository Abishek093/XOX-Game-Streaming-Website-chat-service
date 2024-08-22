import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import http from 'http'
import WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection',(ws: WebSocket)=> {
    wss.on('message', (message: string) => {
        console.log(`Received message=>${message}`)
    })
    ws.send("Welcome to the chat service!")
})

app.get('/', (req, res) => {
    res.send('Chat service is running')
})
const PORT = process.env.port || 5001
server.listen(PORT, () => {
  console.log(`Chat service listening on port ${PORT}`);
});