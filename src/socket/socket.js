import io from 'socket.io-client'

let socket

export const initiateSocketWithVideo = (room, socketId) => {
  socket = io('http://localhost:5000')
  console.log(`Connecting socket...`)
  if (socket && room) socket.emit('join', room, socketId)
}

// export const disconnectSocket = () => {
//   console.log('Disconnecting socket...')
//   if(socket) socket.disconnect()
// }

export const disconnectSocketVideo = (room, socketId) => {
  console.log('Disconnecting socket...')
  if(socket) {
    socket.to(room).emit('disconnect', socketId)
    socket.disconnect()
  }
}

export const subscribeToClass = (cb, htmlTab, cssTab, jsTab) => {
  if (!socket) return(true)
  socket.on('coding', ( code, socketId ) => {
    console.log(`Websocket event received (${code})! from ${socketId}`)
    return cb(null, code, socketId)
  })
}

export const getActiveTab = (isHtmlTabOpen, isCssTabOpen, isJsTabOpen) => {
  if (!socket) return(true)
  socket.on('change tab', (html, css, js) => {
    isHtmlTabOpen(html)
    isCssTabOpen(css)
    isJsTabOpen(js)
  })
}

// export const callNewClassmate = (stream, classmateVideo) => {
//   if (!socket) return(true)
//   socket.on('classmate joined', (classmateId) => {
//     const call = myPeer.call(classmateId, stream)
//     call.on('stream', classmateVideoStream => {
//       console.log('is streaming', classmateVideoStream)
//       classmateVideo.current.srcObject = classmateVideoStream
//     })
//   })
// }

export const callNewClassmate = (stream, myPeer, cb) => {
  if (!socket) return(true)
  socket.on('classmate joined', (classmateId) => {
    const call = myPeer.call(classmateId, stream)
    console.log('call from callNewClassmate', call)
    cb(call)
  })
}

// export const streamCall = ( call, cb ) => {
//   console.log('from streamcall', call)
//   if (!call)  return 
//   call.on('stream', classmateVideoStream => {
//       console.log('is streaming', classmateVideoStream)
//       cb(classmateVideoStream)
//     })
// }

export const streamCall = ( call, classmateVideo ) => {
  console.log('from streamcall', call)
  if (!call)  return 
  call.on('stream', classmateVideoStream => {
      console.log('is streaming', classmateVideoStream)
      classmateVideo.current.srcObject = classmateVideoStream
    })
}

export const sendCode = (room, code, socketId) => {
  if (socket) socket.emit('coding', code, room, socketId)
}

export const changeTab = (room, html, css, js) => {
  if (socket) socket.emit('change tab', room, html, css, js)
}