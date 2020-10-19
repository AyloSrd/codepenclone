import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage'
import Peer from 'peerjs'
import { initiateSocketWithVideo, subscribeToClass } from './socket/socket'
import { getCamera, answerCalls } from './peer/getCameraAndAnswerCalls'


const ClassroomSocketVideo = () => {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ incomingHtml, setIncomingHtml ] = useState('')
  const [ incomingCss, setIncomingCss ] = useState('')
  const [ incomingJs, setIncomingJs ] = useState('')

  const [ socketId, setSocketId ] = useState(null)
  const [ myPeer, setMyPeer] = useState('')

  const [srcDoc, setSrcDoc] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  // video
  const userVideo = useRef()
	const classmateVideo = useRef()
  const [ stream, setStream ] = useState()
  
  useEffect(() => {
    const myPeer = new Peer( undefined, {
      host:'/',
      port: '8000'
    })
    setMyPeer(myPeer)

    myPeer.on('open', id => {
      setSocketId(id)
    })

    getCamera(userVideo, setStream)
  }, [])

  useEffect(() => {
    if(!socketId) return console.log(socketId)
    console.log(socketId)
    initiateSocketWithVideo('class', socketId)
    subscribeToClass((_, code, socketId) => {
        setIncomingHtml(code.html)
        setIncomingCss(code.css)
        setIncomingJs(code.js)
    })
    // return () => disconnectSocketVideo('class', socketId)
  }, [ socketId ])

  useEffect(() => {
    if (!myPeer) return console.log('peer not there')
    answerCalls(stream, classmateVideo, myPeer)
  }, [ myPeer ])

  console.log( 'in render', incomingHtml, incomingCss, incomingJs )

  useEffect(() => {
    if(!socketId) return console.log(socketId)
    if (!isPaused) {
      setHtml(incomingHtml)
      setCss(incomingCss)
      setJs(incomingJs)
      console.log( 'in useEffect', incomingHtml, incomingCss, incomingJs )
    }
  }, [ incomingHtml, incomingCss, incomingJs ])

  useEffect(() => {
    if (!isPaused) {
      setHtml(incomingHtml)
      setCss(incomingCss)
      setJs(incomingJs)
    }
  }, [ isPaused ])

  useEffect(() => {
   const timeout = setTimeout(() => {
    if(!socketId) return () => clearTimeout(timeout)

    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>HTML Document</title>
          <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
        <script>
          ${js}
        </script>
      </html>
    `)
   }, 1000)

   return () => clearTimeout(timeout)
  }, [ html, css, js ])

  return (
    <>
      <h1>Student</h1>
      <div className="pane top-pane">
        <button onClick= {
          () =>{
            setIsPaused(prevPaused => !prevPaused)
          }
        }>
          { isPaused
            ? 'play'
            : 'pause'
            }
          </button>
        <Editor 
          language="xml" 
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor 
          language="css" 
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor 
          language="javascript" 
          displayName="JS"
          value={js}
          onChange={setJs}
        />
      </div>
      <div className="pane">
        <iframe 
        srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100vw"
          height="100%"
          />
      </div>
      <div>
        <video playsInline muted ref={userVideo} autoPlay/>
        <video playsInline muted ref={classmateVideo} autoPlay/>
		</div>
    </>
  );
}

export default ClassroomSocketVideo;
