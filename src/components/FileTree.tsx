import  { useRef } from "react";
import { Tree, TreeEventNodeEvent } from "primereact/tree";
import { Toast } from "primereact/toast";
import useStore from "../store/store";


export const FileTree=()=> {
    
    const toast = useRef<Toast>(null);

    const {fileNodes,selectedFileNodeKey,setSelectedFileNodeKey}=useStore();

    const onExpand = (event: TreeEventNodeEvent) => {
        toast.current?.show({
            severity: "success",
            summary: "Node Expanded",
            detail: event.node.label,
        });
    };

    const onCollapse = (event: TreeEventNodeEvent) => {
        toast.current?.show({
            severity: "warn",
            summary: "Node Collapsed",
            detail: event.node.label,
        });
    };

    const onSelect = (event: TreeEventNodeEvent) => {
        toast.current?.show({
            severity: "info",
            summary: "Node Selected",
            detail: event.node.label,
        });
    };

    const onUnselect = (event: TreeEventNodeEvent) => {
        toast.current?.show({
            severity: "info",
            summary: "Node Unselected",
            detail: event.node.label,
        });

    };

    const setSelectedNodeKey=(key:string | undefined)=>{
        if(key){
            setSelectedFileNodeKey(key);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="card flex justify-content-center h-full">
                <Tree
                    value={fileNodes}
                    selectionMode="single"
                    selectionKeys={selectedFileNodeKey}
                    onSelectionChange={(e) => setSelectedNodeKey(e.value as string)}
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    onSelect={onSelect}
                    onUnselect={onUnselect}
                    className="w-full md:w-30rem"
                />
            </div>
        </>
    );
}
