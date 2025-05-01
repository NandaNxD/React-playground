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
import useStore, { FileNode } from "./store/store";
import Header from "./components/Header";
import { FileTree } from "./components/FileTree";
import { REACT_CHART_JS_TEMPLATE } from "./templates/REACT_CHARTJS_TEMPLATE";



function App() {
    const [code, setCode] = useState('');

    const [err,setErr]=useState<string | null>('');
    const {addDependencyLibraryTypesToMonaco,setFileData,selectedFileNodeKey,fileNodes}=useStore();


    const initializeIframeReactApp = async () => {
      try{
        await Bundler.initializeBundler()
        await bundleCode(REACT_CHART_JS_TEMPLATE,fileNodes);
      }
      catch(err){}
    };

    useEffect(() => {
        initializeIframeReactApp();
    }, []);

    const bundleCode = async (code: string,files:FileNode[]) => {
        const transpiledCode = await Bundler.bundleCode(code,files);

        if(transpiledCode?.error){
            setErr(transpiledCode.error);
            return;
        }

        setErr(null);
        setCode(transpiledCode?.code || "");

        addDependencyLibraryTypesToMonaco(code);
        
    };

    const debouncedBundleFunction = useCallback(
        debounce(bundleCode, DEBOUNCE_TIME_IN_MS),
        []
    );


    useEffect(()=>{
        debouncedBundleFunction(fileNodes.find((file)=>file.key==='App.tsx')?.fileData?.value!,fileNodes);
    },[fileNodes])


    return (
        <>
            <Header></Header>
            <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
                <Panel defaultSize={15}>
                    <FileTree></FileTree>
                </Panel>

                <PanelResizeHandle className="resize-handle">
                    <div className="resize-image"></div>
                </PanelResizeHandle>

                <Panel defaultSize={55}>
                    <CodeEditor
                        onChange={(value: string | undefined): void => {
                            setFileData(selectedFileNodeKey,value!);
                            // debouncedBundleFunction(value || "");
                        }}
                        initialValue={REACT_CHART_JS_TEMPLATE}
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
