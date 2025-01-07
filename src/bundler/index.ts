import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

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

    bundleCode: async function (rawCode: string) {
        try {
            const result = await esbuild.build({
                entryPoints: ["index.js"],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
                define: {
                    "process.env.NODE_ENV": '"production"',
                    global: "window",
                },
            });

            return {
                code: result.outputFiles[0].text,
                error: null,
            };
        } catch (err: any) {
            console.log(err.message);
            return {
                code: "",
                error: err.message,
            };
        }
    },
};
