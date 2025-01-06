import { useEffect, useRef, useState } from 'react';
import './App.css'
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/CodeEditor';
import { REACT_TEMPLATE } from './templates/REACT_TEMPLATE';
import { editor } from 'monaco-editor';
import 'bulmaswatch/cosmo/bulmaswatch.min.css';
import Preview from './components/Preview';

function App() {

  const [code,setCode]=useState('');

  const ref = useRef<HTMLDivElement>(null);

  

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
      
      setCode(result.outputFiles[0].text);

    }
    catch(err){
      console.log(err)
    }
    
  }

  
  return (
      <div ref={ref}>

        <CodeEditor onChange={(value: string | undefined, ev: editor.IModelContentChangedEvent):void=>{
          transpileCode(value || '')
        }} initialValue={REACT_TEMPLATE}></CodeEditor> 
        
        <Preview code={code}></Preview>
         
      </div>
  );
}

export default App
