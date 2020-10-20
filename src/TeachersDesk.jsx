import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage'
import Peer from 'peerjs'
import { initiateSocketWithVideo, sendCode, callNewClassmate, streamCall, changeTab } from './socket/socket'
import { getCamera } from './peer/getCameraAndAnswerCalls'


const TeachersDesk = () => {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ isHtmlTabOpen, setIsHtmlTabOpen ] = useState(true)
  const [ isCssTabOpen, setIsCssTabOpen ] = useState(false)
  const [ isJsTabOpen, setIsJsTabOpen ] = useState(false)
  
  const [ socketId, setSocketId ] = useState(null)
  const [ myPeer, setMyPeer] = useState('')

  const [srcDoc, setSrcDoc] = useState('')

  // video
  const userVideo = useRef()
  const classmateVideo = useRef()
  const [ stream, setStream ] = useState()
  const [ call, setCall ] = useState(null)
  // const [ studentsVideos, setStudentsVideos] = useState([])
  
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
    // return () => disconnectSocketVideo('class', socketId)
  }, [ socketId ])

  useEffect(() => {
    callNewClassmate(stream, myPeer, setCall)
  }, [ stream ])

  // const appendVideos = mediaStream => {
  //   setStudentsVideos(prevVideos => [ ...prevVideos, mediaStream])
  // }

  useEffect(() => {
    if(!call) return console.log('no call')
    streamCall(call, classmateVideo)
  }, [ call ])

  useEffect(() => {
   const timeout = setTimeout(() => {
    if(!socketId) return () => clearTimeout(timeout)
    console.log(html, css, js)
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
    sendCode('class', {
      html,
      css, 
      js
    }, socketId)
   }, 1000)

   return () => clearTimeout(timeout)
  }, [ html, css, js ])
  
  useEffect(() => {
    console.log('changing tab')
    changeTab( 'class', isHtmlTabOpen, isCssTabOpen, isJsTabOpen )
  }, [ isHtmlTabOpen, isCssTabOpen, isJsTabOpen ])

  const openTab = e => {
    console.log('changing tab on click')
    setIsHtmlTabOpen(false)
    setIsCssTabOpen(false)
    setIsJsTabOpen(false)

    switch (e.target.name) {
      case 'htmlTab':
        setIsHtmlTabOpen(true)
        break
      case 'cssTab':
        setIsCssTabOpen(true)
        break;
      case 'jsTab':
        setIsJsTabOpen(true)
        break;
      default:
        setIsHtmlTabOpen(true)
    }
    
  }

  return (
    <>
      <div id="EditorAndIframeContainer">
        <div className="pane left-pane">
          <div class="Tab">
            <button 
              name="htmlTab" 
              className={`Tablinks ${ isHtmlTabOpen ? 'open' : '' }`} 
              onClick={openTab}>HTML</button>
            <button 
              name="cssTab" 
              className={`Tablinks ${ isCssTabOpen ? 'open' : '' }`} 
              onClick={openTab}>CSS</button>
            <button 
              name="jsTab" 
              className={`Tablinks ${ isJsTabOpen ? 'open' : '' }`} 
              onClick={openTab}>JS</button>
          </div>
          <Editor 
            language="xml"
            value={html}
            onChange={setHtml}
            open={isHtmlTabOpen}
          />
          <Editor 
            language="css" 
            value={css}
            onChange={setCss}
            open={isCssTabOpen}
          />
          <Editor 
            language="javascript" 
            value={js}
            onChange={setJs}
            open={isJsTabOpen}
          />
        </div>
        <div className="pane right-pane">
          <iframe 
          srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100vw"
            height="100%"
            />
        </div>
      </div>
      <div id="VideoContainer">
        <div className="Video SmallV">
          <video playsInline muted ref={classmateVideo} autoPlay/>
        </div>
        <div className="Video">
          <video playsInline muted ref={userVideo} autoPlay/>
        </div>
		  </div>
    </>
  );
}

export default TeachersDesk
