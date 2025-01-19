import { setupTypeAcquisition } from "@typescript/ata";
import ts from "typescript";

interface AutomaticTypeAcquisitionConstructorProps{
    startAta?:()=>void,
    progressAta?:(downloaded:number,total:number)=>void,
    receivedFilesAta?:(code:string, path:string)=>void, 
    finishedAta?:(files:Map<string,string>)=>void 
}
console.log(ts.version)
export class AutomaticTypeAcquisition {
    ata: (initialSourceFile: string) => Promise<void>;

    constructor({
        startAta,
        progressAta,
        receivedFilesAta,
        finishedAta,
    }: AutomaticTypeAcquisitionConstructorProps) {
        this.ata = setupTypeAcquisition({
            projectName: "React-playground",
            typescript: ts,
            logger: console,
            delegate: {
                receivedFile: (code: string, path: string) => {
                    // Add code to your runtime at the path...
                    if (receivedFilesAta) receivedFilesAta(code,'file://'+ path);
                },
                started: () => {
                    if(startAta)
                    startAta();
                },
                progress: (downloaded: number, total: number) => {
                    //console.log(`Got ${downloaded} out of ${total}`);
                    if(progressAta)
                    progressAta(downloaded, total);
                },
                finished: (files: Map<string, string>) => {
                    //console.log("ATA done", vfs);
                    if(finishedAta)
                    finishedAta(files);
                },
            },
        });
    }

    fetchDependencyTypes(code: string) {
        this.ata(code);
    }
}
