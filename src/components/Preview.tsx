import { useEffect, useRef } from 'react';
import './Preview.css'
import { HTML_IFRAME_TEMPLATE } from '../templates/HTML_IFRAME_TEMPLATE';

interface PreviewProps{
    code:string, 
    error:string | null
}

const html = HTML_IFRAME_TEMPLATE;

const Preview = ({code,error}:PreviewProps) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(()=>{
        if(!iframeRef.current){
            return;
        }
        
        iframeRef.current.srcdoc = html;

        setTimeout(()=>{
           iframeRef.current?.contentWindow?.postMessage(code, "*");
        },50);

    },[code,error])


    return (
        <div className="preview-wrapper">
            <iframe
                srcDoc={html}
                ref={iframeRef}
                className={error ? "hide" : ""}
                sandbox="allow-scripts"
                title="preview"
            ></iframe>

            {error && (
                <div className="preview-error">
                    <strong>Compile Error</strong> <pre style={{background:'white',fontSize:'small'}}>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default Preview