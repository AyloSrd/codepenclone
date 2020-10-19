import React, { Component, useState, useEffect, useRef } from 'react'
import './App.css'
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage'
import myPeer from './peer/myPeer'
import { initiateSocketWithVideo, subscribeToClass, sendCode, callNewClassmate, streamCall } from './socket/socket'
import { getCamera, answerCalls } from './peer/getCameraAndAnswerCalls'


const ClassroomSocketVideo = () => {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ incomingHtml, setIncomingHtml ] = useState('')
  const [ incomingCss, setIncomingCss ] = useState('')
  const [ incomingJs, setIncomingJs ] = useState('')

  const [ socketId, setSocketId ] = useState(null)

  const [srcDoc, setSrcDoc] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  // video
  const userVideo = useRef()
	const classmateVideo = useRef()
  const [ stream, setStream ] = useState()
  const [ call, setCall ] = useState(null)
  
  useEffect(() => {
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
    callNewClassmate(stream, setCall)
    answerCalls(stream, classmateVideo)
  }, [ stream ])

  useEffect(() => {
    console.log('use effect', call)
    streamCall(call, classmateVideo)
  }, [ call ])
  console.log('call in render', call)
  useEffect(() => {
    if(!socketId) return console.log(socketId)
    if (!isPaused) {
      setHtml(incomingHtml)
      setCss(incomingCss)
      setJs(incomingJs)
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
    sendCode('class', {
      html,
      css, 
      js
    }, socketId)
   }, 1000)

   return () => clearTimeout(timeout)
  }, [ html, css, js ])

  return (
    <>
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
