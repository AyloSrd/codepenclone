import React, { useState, useEffect, useRef } from 'react'
import Peer from 'peerjs'

const VideoContainer = () => {
	const userVideo = useRef()
	const partnerVideo = useRef()
	const [ stream, setStream ] = useState()

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
			setStream(stream);
			if (userVideo.current) {
			  userVideo.current.srcObject = stream;
			}
		})
	}, [])

	console.log(stream)
	return (
		<div>
			<video playsInline muted ref={userVideo} autoPlay/>
			<video playsInline muted ref={partnerVideo} autoPlay/>
		</div>
	)
}

export default VideoContainer
