import { useCallback, useEffect, useState } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import CodeEditor from "./components/CodeEditor";
import { REACT_TEMPLATE } from "./templates/REACT_TEMPLATE";
import "bulmaswatch/cosmo/bulmaswatch.min.css";
import Preview from "./components/Preview";
import  { Bundler } from "./bundler";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DEBOUNCE_TIME_IN_MS } from "./Constants";
import useStore from "./store/store";
import Header from "./components/Header";



function App() {
    const [code, setCode] = useState('');

    const [err,setErr]=useState<string | null>('');
    const {addDependencyLibraryTypesToMonaco}=useStore();


    const initializeIframeReactApp = async () => {
      try{
        await Bundler.initializeBundler()
        await bundleCode(REACT_TEMPLATE);
      }
      catch(err){}
    };

    useEffect(() => {
        initializeIframeReactApp();
    }, []);

    const bundleCode = async (code: string) => {
        const transpiledCode = await Bundler.bundleCode(code);

        if(transpiledCode.error){
            setErr(transpiledCode.error);
            return;
        }

        setErr(null);
        setCode(transpiledCode.code || "");

        addDependencyLibraryTypesToMonaco(code);
        
    };

    const debouncedBundleFunction = useCallback(
        debounce(bundleCode, DEBOUNCE_TIME_IN_MS),
        []
    );


    return (
        <>
            <Header></Header>
            <PanelGroup direction="horizontal" style={{ height: "100vh" }}>

                <Panel defaultSize={70}>
                    <CodeEditor
                        onChange={(
                            value: string | undefined,
                        ): void => {
                            debouncedBundleFunction(value || "");
                        }}
                        initialValue={REACT_TEMPLATE}
                    ></CodeEditor>
                </Panel>

                <PanelResizeHandle className="resize-handle">
                    <div className="resize-image"></div>
                </PanelResizeHandle>

                <Panel defaultSize={30}>
                    <Preview code={code} error={err}></Preview>
                </Panel>
            </PanelGroup>
        </>
    );
}

export default App;
