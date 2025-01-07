import { useEffect, useRef } from 'react';
import './Preview.css'

interface PreviewProps{
    code:string
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

const Preview = ({code}:PreviewProps) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(()=>{
        if(!iframeRef.current){
            return;
        }
        iframeRef.current.srcdoc = html;
        
        setTimeout(()=>{
           iframeRef.current?.contentWindow?.postMessage(code, "*");
        },50);

    },[code])

    return (
        <div className='preview-wrapper'>
            <iframe
                srcDoc={html}
                ref={iframeRef}
                sandbox="allow-scripts"
                title="preview"
            ></iframe>
        </div>
    );
}

export default Preview