import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { create } from "zustand";
import { AutomaticTypeAcquisition } from "../automatic-type-acquisition/automaticTypeAcquisition";
import { REACT_TEMPLATE } from "../templates/REACT_TEMPLATE";
import { STYLES_CSS_TEMPLATE } from "../templates/STYLES_CSS_TEMPLATE";
import { REACT_CHART_JS_TEMPLATE } from "../templates/REACT_CHARTJS_TEMPLATE";

export interface FileNode {
    key: string;
    label: string;
    data?: any; // optional data property to hold any data
    icon?: string; // optional icon property for node
    children?: FileNode[]; // optional children property to hold child nodes
    isDirectory: boolean;
    fileData?: {
        name: string;
        language: string;
        value: string;
    };
}

type Store = {
    monaco: Monaco | null;
    setMonaco: (monaco: Monaco) => void;
    editor: editor.IStandaloneCodeEditor | null;
    setEditor: (editor: editor.IStandaloneCodeEditor) => void;
    automaticTypeAcquisiton: AutomaticTypeAcquisition;
    addDependencyLibraryTypesToMonaco: (code: string) => void;

    fileNodes: FileNode[];
    selectedFileNodeKey: string;
    setSelectedFileNodeKey: (key:string)=>void;
    setFileData: (fileName: string,code:string)=>void;

};



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


const useStore = create<Store>()((set) => ({
    monaco: null,

    automaticTypeAcquisiton: new AutomaticTypeAcquisition({
        receivedFilesAta: onReceivedFiles,
    }),

    editor: null,

    setMonaco: (monaco: Monaco) =>
        set((state) => {
            (window as any)["monaco"] = monaco;
            return { ...state, monaco: monaco };
        }),

    setEditor: (editor: editor.IStandaloneCodeEditor) =>
        set((state) => {
            return {
                ...state,
                editor,
            };
        }),

    addDependencyLibraryTypesToMonaco: (code: string) =>
        set((state) => {
            state.automaticTypeAcquisiton.fetchDependencyTypes(code);
            return state;
        }),

    fileNodes: [
        {
            key: "App.tsx",
            label: "App.tsx",
            data: "Documents Folder",
            icon: "pi pi-fw pi-file",
            isDirectory: false,
            fileData: {
                name: "App.tsx",
                value: REACT_CHART_JS_TEMPLATE,
                language: "typescript",
            },
        },
        {
            key: "styles.css",
            label: "styles.css",
            data: "Events Folder",
            icon: "pi pi-fw pi-file",
            isDirectory: false,
            fileData: {
                name: "styles.css",
                value: STYLES_CSS_TEMPLATE,
                language: "css",
            },
        },
    ],
    selectedFileNodeKey: "App.tsx",
    setSelectedFileNodeKey: (key: string) =>
        set((state) => {
            return {
                ...state,
                selectedFileNodeKey: key,
            };
        }),

    setFileData: (fileName: string, code: string) =>
        set((state) => {
            const fileIndex = state.fileNodes.findIndex(
                (file) => file.fileData?.name === fileName
            );

            if (fileIndex === -1) {
                console.warn(`File ${fileName} not found`);
                return {}; // No changes
            }

            const file = { ...state.fileNodes[fileIndex] };

            if (file.fileData) {
                file.fileData = { ...file.fileData, value: code };
            }

            const newFileNodes = [
                ...state.fileNodes.slice(0, fileIndex),
                file,
                ...state.fileNodes.slice(fileIndex + 1),
            ];

            return {
                fileNodes: newFileNodes,
            };
        }),
}));



export default useStore;
