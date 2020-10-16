import React, { useState, useEffect } from 'react';
import './App.css';
import Editor from './Components/Editor'
import VideoContainer from './Components/VideoContainer'
import useLocalStorage from './hooks/useLocalStorage';
import { initiateSocket, disconnectSocket,
	subscribeToClass, sendCode } from './socket/socket'


function AppSocket() {

  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')

  const [ incomingHtml, setIncomingHtml ] = useState('')
  const [ incomingCss, setIncomingCss ] = useState('')
  const [ incomingJs, setIncomingJs ] = useState('')

  const [srcDoc, setSrcDoc] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    initiateSocket('class')
    subscribeToClass((_, code) => {
        setIncomingHtml(code.html)
        setIncomingCss(code.css)
        setIncomingJs(code.js)
    })
    return () => disconnectSocket()
  }, [])

  useEffect(() => {
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
    })
   }, 1000)

   return () => clearTimeout(timeout)
  }, [ html, css, js ])

  console.log(isPaused)
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
      <VideoContainer />
    </>
  );
}

export default AppSocket;
