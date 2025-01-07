import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import CodeEditor from "./components/CodeEditor";
import { REACT_TEMPLATE } from "./templates/REACT_TEMPLATE";
import { editor } from "monaco-editor";
import "bulmaswatch/cosmo/bulmaswatch.min.css";
import Preview from "./components/Preview";
import bundle from "./bundler";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DEBOUNCE_TIME_IN_MS } from "./Constants";


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
                    initialValue={REACT_TEMPLATE}
                ></CodeEditor>
            </Panel>

            <PanelResizeHandle className="resize-handle">
                <div className="resize-image"></div>
            </PanelResizeHandle>

            <Panel defaultSize={30} >
                <Preview code={code}></Preview>
            </Panel>
        </PanelGroup>
    );
}

export default App;
