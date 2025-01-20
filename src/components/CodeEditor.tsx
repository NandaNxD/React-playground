import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import parserBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { useEffect, useRef, useState } from "react";

import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import "./CodeEditor.css";
import { REACT_TEMPLATE } from "../templates/REACT_TEMPLATE";
import useStore from "../store/store";

import { loader } from "@monaco-editor/react";
import { CDN_MONACO_URL } from "../constants/constant";

loader.config({
    paths: { vs: CDN_MONACO_URL },
});


export interface CodeEditorProps {
    initialValue: string;

    onChange: (
        value: string | undefined,
        ev: editor.IModelContentChangedEvent
    ) => void;
}


const CodeEditor = ({ onChange, initialValue }: CodeEditorProps) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("");
    

    const {setMonaco,setEditor,fileNodes,selectedFileNodeKey}=useStore();

    useEffect(()=>{

        const selectedFile = fileNodes.filter((node) => {
            return node.key === selectedFileNodeKey;
        })[0];

        setValue(selectedFile.fileData?.value!);
        setName(selectedFile.fileData?.name!);
        setLanguage(selectedFile.fileData?.language!);
        
    },[selectedFileNodeKey]);

    const handleEditorDidMount = async (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => {
        monaco.languages.register({ id: "javascript" });
        editorRef.current = editor;

        setMonaco(monaco);
        setEditor(editor);

        console.log('Monaco editor did mount')

        enableSelfClosingTags(editor,monaco);
        shikiSyntaxHighlighting(monaco);
    };


    const getEditorValue = () => {
        return editorRef.current?.getValue() || "";
    };

    const onBeforeMount = async (monaco: Monaco) => {
        

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            jsxFactory: "React.createElement",
            reactNamespace: "React",
            allowNonTsExtensions: true,
            allowJs: true,
            esModuleInterop:true,
            allowSyntheticDefaultImports: true,
            target: monaco.languages.typescript.ScriptTarget.Latest
        });

        const selectedFile=fileNodes.filter((node)=>{
            return node.key===selectedFileNodeKey;
        })[0]

        setValue(selectedFile.fileData?.value!);
        setName(selectedFile.fileData?.name!);
        setLanguage(selectedFile.fileData?.language!);

    }

    const shikiSyntaxHighlighting = async (monaco: Monaco) => {
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
    };

    const enableSelfClosingTags = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => {
        editor.onKeyDown((event: any) => {
            // select enabled languages
            const enabledLanguages = [
                "javascript",
                "typescript",
            ]; // enable js & ts for jsx & tsx

            const model = editor.getModel();
            
            if (!enabledLanguages.includes(model!.getLanguageId())) {
                return;
            }

            const isSelfClosing = (tag: any) =>
                [
                    "area",
                    "base",
                    "br",
                    "col",
                    "command",
                    "embed",
                    "hr",
                    "img",
                    "input",
                    "keygen",
                    "link",
                    "meta",
                    "param",
                    "source",
                    "track",
                    "wbr",
                    "circle",
                    "ellipse",
                    "line",
                    "path",
                    "polygon",
                    "polyline",
                    "rect",
                    "stop",
                    "use",
                ].includes(tag);

            // when the user enters '>'
            if (event.browserEvent.key === ">") {
                const currentSelections = editor.getSelections();

                const edits: any[] = [];
                const newSelections: any[] = [];
                // potentially insert the ending tag at each of the selections
                if (currentSelections)
                    for (const selection of currentSelections) {
                        // shift the selection over by one to account for the new character
                        newSelections.push(
                            new monaco.Selection(
                                selection.selectionStartLineNumber,
                                selection.selectionStartColumn + 1,
                                selection.endLineNumber,
                                selection.endColumn + 1
                            )
                        );
                        // grab the content before the cursor

                        const contentBeforeChange = model!.getValueInRange({
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: selection.endLineNumber,
                            endColumn: selection.endColumn,
                        });

                        // if ends with a HTML tag we are currently closing
                        const match = contentBeforeChange.match(
                            /<([\w-]+)(?![^>]*\/>)[^>]*$/
                        );
                        if (!match) {
                            continue;
                        }

                        const [fullMatch, tag] = match;

                        // skip self-closing tags like <br> or <img>
                        if (
                            isSelfClosing(tag) ||
                            fullMatch.trim().endsWith("/")
                        ) {
                            continue;
                        }

                        // add in the closing tag
                        edits.push({
                            range: {
                                startLineNumber: selection.endLineNumber,
                                startColumn: selection.endColumn + 1, // add 1 to offset for the inserting '>' character
                                endLineNumber: selection.endLineNumber,
                                endColumn: selection.endColumn + 1,
                            },
                            text: `</${tag}>`,
                        });
                    }

                // wait for next tick to avoid it being an invalid operation
                setTimeout(() => {
                    editor.executeEdits(
                        model!.getValue(),
                        edits,
                        newSelections
                    );
                }, 0);
            }
        });
    };

    const onFormatClick = async () => {
        const unformatted = getEditorValue();

        const formatted = await prettier.format(unformatted, {
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
                language={language}

                value={value}
                path={name}
                onChange={onChange}
            />
        </div>
    );
}

export default CodeEditor

// rm -rf ./node_modules/.vite