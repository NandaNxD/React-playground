import { useEffect, useRef, useState } from "react";
import "./App.css";

import CodeEditor from "./components/CodeEditor";
import { REACT_TEMPLATE } from "./templates/REACT_TEMPLATE";
import { editor } from "monaco-editor";
import "bulmaswatch/cosmo/bulmaswatch.min.css";
import Preview from "./components/Preview";
import bundle from "./bundler";

function App() {
    const [code, setCode] = useState("");

    const initializeReactApp = async () => {
      try{
        await bundleCode(REACT_TEMPLATE);
      }
      catch(err){}
    };

    useEffect(() => {
        (async()=>{await initializeReactApp()})();
    }, []);

    const bundleCode = async (code: string) => {
        const transpiledCode = await bundle(code);
        setCode(transpiledCode || "");
    };

    return (
        <div>
            <CodeEditor
                onChange={(
                    value: string | undefined,
                    ev: editor.IModelContentChangedEvent
                ): void => {
                    bundleCode(value || "");
                }}
                initialValue={REACT_TEMPLATE}
            ></CodeEditor>

            <Preview code={code}></Preview>
        </div>
    );
}

export default App;
