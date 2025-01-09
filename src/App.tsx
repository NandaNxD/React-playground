import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import CodeEditor from "./components/CodeEditor";
import { REACT_TEMPLATE } from "./templates/REACT_TEMPLATE";
import { editor } from "monaco-editor";
import "bulmaswatch/cosmo/bulmaswatch.min.css";
import Preview from "./components/Preview";
import  { Bundler } from "./bundler";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DEBOUNCE_TIME_IN_MS } from "./Constants";
import { REACT_TYPESCRIPT_TEMPLATE } from "./templates/REACT_TEMPLATE_TYPESCRIPT";


function App() {
    const [code, setCode] = useState("");
    const [err,setErr]=useState<string | null>('');

    const initializeIframeReactApp = async () => {
      try{
        await Bundler.initializeBundler()
        await bundleCode(REACT_TEMPLATE);
      }
      catch(err){}
    };

    useEffect(() => {
        (async()=>{await initializeIframeReactApp();})();
    }, []);

    const bundleCode = async (code: string) => {
        const transpiledCode = await Bundler.bundleCode(code);

        if(transpiledCode.error){
            setErr(transpiledCode.error);
            return;
        }

        setErr(null);
        setCode(transpiledCode.code || "");
    };

    const debouncedBundleFunction = useCallback(
        debounce(bundleCode, DEBOUNCE_TIME_IN_MS),
        []
    );

    return (
        <PanelGroup  direction="horizontal" style={{height:'100vh'}}>
            <Panel defaultSize={70}>
                <CodeEditor
                    onChange={(
                        value: string | undefined,
                        ev: editor.IModelContentChangedEvent
                    ): void => {
                        debouncedBundleFunction(value || "");
                    }}
                    initialValue={REACT_TYPESCRIPT_TEMPLATE}
                ></CodeEditor>
            </Panel>

            <PanelResizeHandle className="resize-handle">
                <div className="resize-image"></div>
            </PanelResizeHandle>

            <Panel defaultSize={30} >
                <Preview code={code} error={err}></Preview>
            </Panel>
        </PanelGroup>
    );
}

export default App;
