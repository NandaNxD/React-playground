import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { create } from "zustand";

type Store = {
    monaco: Monaco | null;
    setMonaco: (monaco: Monaco) => void;
    editor:editor.IStandaloneCodeEditor | null,
    setEditor:(editor:editor.IStandaloneCodeEditor) => void,

    //addDependencyLibraryTypesToMonaco: (code: string, path: string) => void;
};

const useStore = create<Store>()((set) => ({
    monaco: null,

    editor:null,

    setMonaco: (monaco: Monaco) =>
        set((state) => ({ ...state, monaco: monaco })),

    setEditor:(editor:editor.IStandaloneCodeEditor)=>set((state)=>{

        return {
            ...state, 
            editor
        }
    })
}));



export default useStore;
