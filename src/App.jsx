import React, { useState } from 'react';
import './App.css';
import Editor from './Components/Editor'

function App() {
  const [ html, setHtml ] = useState('')
  const [ css, setCss ] = useState('')
  const [ js, setJs ] = useState('')
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
