import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import parserBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { useRef } from 'react';

import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import './CodeEditor.css';


export interface CodeEditorProps{
    initialValue:string,

    onChange:(value: string | undefined, ev: editor.IModelContentChangedEvent)=>void;
}

const CodeEditor = ({onChange,initialValue}:CodeEditorProps) => {

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount=async (editor: editor.IStandaloneCodeEditor, monaco: Monaco)=>  {

        monaco.languages.register({id:'javascript'});
        editorRef.current = editor;
    }

    const getEditorValue=()=> {
        return (editorRef.current?.getValue()) || '';
    }

    const onBeforeMount=async(monaco:Monaco)=>{
        // Create the highlighter, it can be reused

        monaco.languages.register({ id: "javascript" });

        monaco.editor.setTheme("vitesse-dark");

        
        const highlighter = await createHighlighter({
            themes: ['vitesse-dark'],
            langs: ["javascript"],
        });

        shikiToMonaco(highlighter,monaco)

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
        <div className='editor-wrapper'>
            <button className='button isPrimary is-small' onClick={onFormatClick}>Format</button>
            <Editor
                height={'100%'}
                defaultValue={initialValue}
                defaultLanguage="javascript"
                theme="vs-dark"
                options={{
                    wordWrap: "on",
                    showUnused: false,
                    automaticLayout: true,
                    minimap:{
                        enabled:false
                    }
                }}
                onMount={handleEditorDidMount}
                
                onChange={onChange}
            />
        </div>
    );
}

export default CodeEditor
