import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage'
import myPeer from './peer/myPeer'
import { initiateSocketWithVideo, subscribeToClass, sendCode, callNewClassmate } from './socket/socket'
import { getCamera } from './peer/getCameraAndAnswerCalls'


const ClassroomSocketVideo = () => {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ socketId, setSocketId ] = useState(null)

  const [srcDoc, setSrcDoc] = useState('')

  // video
  const userVideo = useRef()
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
    // return () => disconnectSocketVideo('class', socketId)
  }, [ socketId ])

  useEffect(() => {
    callNewClassmate(stream, setCall)
  }, [ stream ])


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

  return (
    <>
      <h1>Professor</h1>
      <div className="pane top-pane">
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
		</div>
    </>
  );
}

export default ClassroomSocketVideo;
