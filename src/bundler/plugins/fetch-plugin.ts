import * as esbuild from "esbuild-wasm";
import localforage from "localforage";
import { FileNode } from "../../store/store";

const fileCache = localforage.createInstance({
    name: "fileCache",
});

export const fetchPlugin = (code: string,files:FileNode[]) => {
    return {
        name: "fetch-plugin",
        setup: (build: esbuild.PluginBuild) => {
            build.onLoad({ filter: /^index\.js$/ }, async () => {
                return {
                    loader: "tsx",
                    contents: code,
                };
            });


            // LOCAL CSS LOADER
            build.onLoad(
                { filter: /.*/, namespace: "css-local" },
                async (args: any) => {

                    const key = args.path.startsWith("./")
                        ? args.path.slice(2)
                        : args.path.slice(3);


                    const css = files.find((file)=>file.key===key)?.fileData?.value ?? "";

                    const escapedCss = css
                        .replace(/\n/g, "")
                        .replace(/"/g, '\\"')
                        .replace(/'/g, "\\'");

                    const contents = `
                        const style = document.createElement("style");
                        style.innerText = "${escapedCss}";
                        document.head.appendChild(style);
                        export default "${escapedCss}";
                    `;
                    const result: esbuild.OnLoadResult = {
                        loader: "js",
                        contents,
                        resolveDir: args.resolveDir,
                    };
                    await fileCache.setItem(args.path, result);
                    return result;
                }
            );

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                const cachedResults =
                    await fileCache.getItem<esbuild.OnLoadResult>(args.path);

                if (cachedResults) {
                    return cachedResults;
                }

                return null;
            });

            // CDN CSS LOADER
            build.onLoad(
                { filter: /.*/, namespace: "css-cdn" },
                async (args: any) => {
                    const cache = await fileCache.getItem<esbuild.OnLoadResult>(
                        args.path
                    );
                    if (cache) return cache;

                    const res = await fetch(args.path);
                    const css = await res.text();
                    const escaped = css.replace(/\n/g, "").replace(/"/g, '\\"');

                    const contents = `
                        const style = document.createElement("style");
                        style.innerText = "${escaped}";
                        document.head.appendChild(style);
                        export default "${escaped}";
                    `;
                    const result: esbuild.OnLoadResult = {
                        loader: "js",
                        contents,
                        resolveDir: new URL("./", args.path).pathname,
                    };
                    await fileCache.setItem(args.path, result);
                    return result;
                }
            );

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                const data = await fetch(args.path);
                const fileText = await data.text();

                const path = new URL("./", data.url).pathname;

                const result: esbuild.OnLoadResult = {
                    loader: "tsx",
                    contents: fileText,
                    resolveDir: path,
                };

                await fileCache.setItem(args.path, result);

                return result;
            });
        },
    };
};
