import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { create } from "zustand";
import { AutomaticTypeAcquisition } from "../automatic-type-acquisition/automaticTypeAcquisition";


const onReceivedFiles = (file: string, path: string) => {
    
    if ((window as any)["monaco"]) {
      
        if (!path.includes('@types')){
            path=path.replace("file:///node_modules", "file:///node_modules/@types");
        }
            (window as any)[
                "monaco"
            ].languages.typescript.typescriptDefaults.addExtraLib(file, path);
    }
};

type Store = {
    monaco: Monaco | null;
    setMonaco: (monaco: Monaco) => void;
    editor:editor.IStandaloneCodeEditor | null,
    setEditor:(editor:editor.IStandaloneCodeEditor) => void,
    automaticTypeAcquisiton:AutomaticTypeAcquisition,
    addDependencyLibraryTypesToMonaco: (code: string) => void;
};

const useStore = create<Store>()((set) => ({
    monaco: null,

    automaticTypeAcquisiton:new AutomaticTypeAcquisition({
        receivedFilesAta: onReceivedFiles,
    }), 

    editor:null,

    setMonaco: (monaco: Monaco) =>
            set((state) => {
                (window as any)['monaco']=monaco;
                return { ...state, monaco: monaco };
            }
        ),

    setEditor:(editor:editor.IStandaloneCodeEditor)=>set((state)=>{

        return {
            ...state, 
            editor
        }
    }), 

    addDependencyLibraryTypesToMonaco:(code:string)=>set((state)=>{
        state.automaticTypeAcquisiton.fetchDependencyTypes(code);
        return state;
    }), 
}));



export default useStore;
