import React, { useState, useEffect } from 'react';
import './App.css';
import Editor from './Components/Editor'
import useLocalStorage from './hooks/useLocalStorage';


function App() {
  const [ html, setHtml ] = useLocalStorage('html', '')
  const [ css, setCss ] = useLocalStorage('css', '')
  const [ js, setJs ] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')

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
   }, 500)

   return () => clearTimeout(timeout)
  }, [ html, css, js ])


  return (
    <>
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
    </>
  );
}

export default App;
