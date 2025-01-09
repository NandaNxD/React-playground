import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import parserBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { useRef, useState } from 'react';

import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter, getHighlighter } from "shiki";
import './CodeEditor.css';
import { REACT_TEMPLATE } from '../templates/REACT_TEMPLATE';


export interface CodeEditorProps{
    initialValue:string,

    onChange:(value: string | undefined, ev: editor.IModelContentChangedEvent)=>void;
}

const CodeEditor = ({onChange,initialValue}:CodeEditorProps) => {

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const [name,setName]=useState('');
    const [value,setValue]=useState('');

    const handleEditorDidMount=async (editor: editor.IStandaloneCodeEditor, monaco: Monaco)=>  {

        monaco.languages.register({id:'javascript'});
        editorRef.current = editor;
    }

    const getEditorValue=()=> {
        return (editorRef.current?.getValue()) || '';
    }

    const onBeforeMount=async(monaco:Monaco)=>{

        const data = await fetch(
            "https://unpkg.com/@types/react@19.0.0/ts5.0/index.d.ts"
        );
        const text = await data.text();

        const reactDom = await fetch(
            "https://unpkg.com/@types/react-dom@19.0.0/client.d.ts"
        );
        const reactDomText = await reactDom.text();

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            text,
            "file:///node_modules/@types/react/index.d.ts"
        );

         monaco.languages.typescript.typescriptDefaults.addExtraLib(
             reactDomText,
             "file:///node_modules/@types/react-dom/client.d.ts"
         );

        // monaco.languages.typescript.typescriptDefaults.addExtraLib(
        //     "export declare function add(a: number, b: number): number",
        //     "file:///node_modules/@types/math/index.d.ts"
        // );

        // const model = monaco.editor.createModel(
        //     `import {add} from 'math';\nconst x = add(3, 5);\n`,
        //     "typescript",
        //     monaco.Uri.parse("file:///main.tsx")
        // );


        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            jsxFactory: "React.createElement",
            reactNamespace: "React",
            allowNonTsExtensions: true,
            allowJs: true,
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowSyntheticDefaultImports:true
        });

        setValue(REACT_TEMPLATE);
        setName("main.tsx");

        shikiSyntaxHighlighting(monaco);
    }

    const shikiSyntaxHighlighting=async (monaco:Monaco)=>{

        void (async () => {
            const ADDITIONAL_LANGUAGES = ["jsx", "tsx", "vue", "svelte"];

            for (const lang of ADDITIONAL_LANGUAGES) {
                monaco.languages.register({ id: lang });
            }

            const highlighter = await createHighlighter({
                themes: ["dark-plus"],
                langs: ADDITIONAL_LANGUAGES,
            });

            shikiToMonaco(highlighter, monaco);
        })();

    }

    const onFormatClick=async()=>{
        const unformatted=getEditorValue();
        
        const formatted=await prettier.format(unformatted, {
            parser: "babel",
            plugins: [parserBabel, prettierPluginEstree],
        });

        editorRef.current?.setValue(formatted)
        
    }

    return (
        <div className="editor-wrapper">
            <button
                className="button isPrimary is-small"
                onClick={onFormatClick}
            >
                Format
            </button>

            <Editor
                height={"100%"}
                //defaultValue={initialValue}
                
                theme="vs-dark"
                options={{
                    wordWrap: "on",
                    showUnused: false,
                    automaticLayout: true,
                    minimap: {
                        enabled: false,
                    },
                }}
                onMount={handleEditorDidMount}
                beforeMount={onBeforeMount}
                language={"typescript"}

                value={value}
                path={name}
                onChange={onChange}
            />
        </div>
    );
}

export default CodeEditor
