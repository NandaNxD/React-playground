import { useEffect, useRef, useState } from 'react';
import './App.css'
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/CodeEditor';
import { REACT_TEMPLATE } from './templates/REACT_TEMPLATE';
import { editor } from 'monaco-editor';
import 'bulmaswatch/cosmo/bulmaswatch.min.css';

function App() {

  const [input,setInput]=useState('');

  const ref = useRef<HTMLDivElement>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startService=async()=>{

    await esbuild.initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm",
    });

  }

  useEffect(()=>{
     (async () => {
         try {
            await startService();
            transpileCode(REACT_TEMPLATE);
             
         } catch (err) {
             
         }
     })();
    
  },[])

  const transpileCode=async(code:string)=>{

    iframeRef.current?.srcdoc!=html;
    
    try{
      let result = await esbuild.build({
        entryPoints:['index.js'],
        bundle:true,
        write:false,
        plugins:[unpkgPathPlugin(), fetchPlugin(code)],
        define:{
          'process.env.NODE_ENV':'"production"',
          global:'window'
        }
      });

      iframeRef.current?.contentWindow?.postMessage(result.outputFiles[0].text,'*');

    }
    catch(err){
      console.log(err)
    }
    
  }

  const html = `
    <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message',(event)=>{
          try{
            eval(event.data);
          }
          catch(err){
            console.log(err);
            document.querySelector('#root').innerHTML='<div style="color:red"><h3>Runtime Error</h3>'+err+'</div>';
            console.error(err);
          }
          
        },false)
      </script>
    </body
    </html>
  `;
  
  return (
      <div ref={ref}>

        <CodeEditor onChange={(value: string | undefined, ev: editor.IModelContentChangedEvent):void=>{
          transpileCode(value || '')
        }} initialValue={REACT_TEMPLATE}></CodeEditor> 
          
          <iframe
              srcDoc={html}
              ref={iframeRef}
              sandbox="allow-scripts"
              title="preview"
          ></iframe>
      </div>
  );
}

export default App
