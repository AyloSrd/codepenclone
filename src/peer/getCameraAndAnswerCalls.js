export const getCamera = (userVideo, setStream) => {
	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true
	  }).then(stream => {
		if (userVideo.current) {
			userVideo.current.srcObject = stream
			setStream(stream)
		}
	  })  
}

export const answerCalls = ( stream, classmateVideo, myPeer ) => {
	myPeer.on('call', call => {
		console.log('from answerCall', call)
		call.answer(stream)
		call.on('stream', classmateVideoStream => {
		  console.log('receaving streaming', classmateVideoStream)
		  classmateVideo.current.srcObject = classmateVideoStream
		})
	  })
}
