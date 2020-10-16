import io from 'socket.io-client'

let socket

export const initiateSocket = room => {
  socket = io('http://localhost:5000')
  console.log(`Connecting socket...`)
  if (socket && room) socket.emit('join', room)
}

export const initiateSocketWithVideo = (room, socketId) => {
  socket = io('http://localhost:5000')
  console.log(`Connecting socket...`)
  if (socket && room) socket.emit('join', room, socketId)
}

export const disconnectSocket = () => {
  console.log('Disconnecting socket...')
  if(socket) socket.disconnect()
}

export const disconnectSocketVideo = (room, socketId) => {
  console.log('Disconnecting socket...')
  if(socket) {
    socket.to(room).emit('disconnect', socketId)
    socket.disconnect()
  }
}

export const subscribeToClass = cb => {
  if (!socket) return(true)
  socket.on('coding', code => {
    console.log('Websocket event received!')
    return cb(null, code)
  })
}

export const sendCode = (room, code) => {
  if (socket) socket.emit('coding', { code, room })
}