import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage'
import Peer from 'peerjs'
import { initiateSocketWithVideo, subscribeToClass, getActiveTab } from './socket/socket'
import { getCamera, answerCalls } from './peer/getCameraAndAnswerCalls'
import saveIcon from './saveIcon.png'

const StudentsDesk = () => {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ incomingHtml, setIncomingHtml ] = useState('')
  const [ incomingCss, setIncomingCss ] = useState('')
  const [ incomingJs, setIncomingJs ] = useState('')

  const [ isHtmlTabOpen, setIsHtmlTabOpen ] = useState(true)
  const [ isCssTabOpen, setIsCssTabOpen ] = useState(false)
  const [ isJsTabOpen, setIsJsTabOpen ] = useState(false)

  const [ socketId, setSocketId ] = useState(null)
  const [ myPeer, setMyPeer] = useState('')

  const [srcDoc, setSrcDoc] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  // video
  const userVideo = useRef()
	const classmateVideo = useRef()
  const [ stream, setStream ] = useState()
  
  useEffect(() => {
    getCamera(userVideo, setStream)
  }, [])

  useEffect(() => {
    const myPeer = new Peer( undefined, {
      host:'/',
      port: '8000'
    })
    setMyPeer(myPeer)

    myPeer.on('open', id => {
      setSocketId(id)
    })
  }, [ stream ])

  useEffect(() => {
    if(!socketId) return console.log(socketId)
    console.log(socketId)
    initiateSocketWithVideo('class', socketId)
    subscribeToClass((_, code, socketId) => {
        setIncomingHtml(code.html)
        setIncomingCss(code.css)
        setIncomingJs(code.js)
    })
    getActiveTab(setIsHtmlTabOpen, setIsCssTabOpen, setIsJsTabOpen)
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

  const openTab = e => {
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

  const handleSave =() => {
    console.log(html, css, js)
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
            <button 
              id="saveBtn" 
              onClick= {handleSave}
              className="Tablinks Right"
            >
              <img width="20px" src={saveIcon} alt="floppy disk icon"/>
            </button>
            <button 
              onClick= {
                () =>{
                  setIsPaused(prevPaused => !prevPaused)
                }}
              className="Tablinks Right"
            >
              <div 
              className={
                isPaused 
                ? 'Play' 
                : 'Pause'
                }>
              </div>
            </button>
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
          <video playsInline muted ref={userVideo} autoPlay/>
        </div>
        <div className="Video">
          <video playsInline muted ref={classmateVideo} autoPlay/>
        </div>
		  </div>
    </>
  );
}

export default StudentsDesk
