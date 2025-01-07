export const HTML_IFRAME_TEMPLATE = `
    <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>

        const handleError=(err)=>{
          document.querySelector('#root').innerHTML='<div style="color:red;font-family: monospace;line-height:1.5;font-size:1rem;font-weight:400"><strong style="color:red;">Runtime Error</strong><div>'+err+'</div></div>';
          console.error(err);
        }

        window.addEventListener('error', (event)=>{
          event.preventDefault();
          handleError(event.error);
        })

        window.addEventListener('message',(event)=>{
          
          try{
            eval(event.data);
          }
          catch(err){
            handleError(err);
          }
          
        },false)
      </script>
    </body
    </html>
  `;