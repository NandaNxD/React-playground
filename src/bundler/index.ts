import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { FileNode } from "../store/store";

export interface BundledCode {
    code: string;
    error: string | null;
}

export const Bundler = {
    initialized: false,

    initializeBundler: async function () {
        if (this.initialized) {
            return;
        }
        await esbuild.initialize({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm",
        });
        this.initialized = true;
    },

    bundleCode: async function (rawCode: string,files:FileNode[]) {
        try {
            const result = await esbuild.build({
                entryPoints: ["index.js"],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin(), fetchPlugin(rawCode,files)],
                define: {
                    "process.env.NODE_ENV": '"production"',
                    global: "window",
                },
                
            });
            return {
                code: result.outputFiles[0].text,
                error: null,
            };
        } catch (err:any) {
            console.log(err.errors);
            let errorMessage=err.message;

            if(err.errors){
                const errorObject=err.errors[err.errors.length-1];
                const formattedErrorMessage = 
                `✘ [ERROR] ${errorObject.text}

                    ${errorObject.location.file}:${errorObject.location.line}:${errorObject.location.column}:
                    ${errorObject.location.line} │ ${errorObject.location.lineText}`


                errorMessage=formattedErrorMessage;
                
            }
            
            return {
                code: "",
                error: errorMessage,
            };
        }
    },
};
