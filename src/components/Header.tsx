import { Dialog } from "primereact/dialog";
import { useState } from "react";
import reactLogo from "../assets/react.webp";

const Header = () => {
    const [questionDialogVisible,setQuestionDialogVisible]=useState(false);

    return (
        <>
            <div className="h-[70px] text-3xl items-center flex px-7 text-white justify-between border border-gray-600">
                <div className="flex items-center gap-3 select-none">
                    <img
                        src={reactLogo}
                        alt="react-logo"
                        className="w-10 h-6 inline"
                    />
                    <span>React Playground</span>
                </div>

                {/* <span
                    className="pi pi-fw pi-question-circle cursor-pointer text-xl"
                    onClick={() => setQuestionDialogVisible(true)}
                ></span> */}
            </div>

            <Dialog
                header="Playground supports external libraries"
                visible={questionDialogVisible}
                className="w-fit"
                onHide={() => {
                    if (!questionDialogVisible) return;
                    setQuestionDialogVisible(false);
                }}
            >
                <span className="m-0 whitespace-pre-wrap block">
                    Copy and paste the code below into imports
                </span>
                <pre className="rounded-md block" style={{padding:'8px',color:'black'}}>
                    {
                    `import {compareAsc, format} from "date-fns"; \n\nformat(new Date(2014, 1, 11), "yyyy-MM-dd");`}
                </pre>
                <span className="whitespace-pre-wrap">
                    {
                    `Wait for some time, till error is gone from editor \nIt will automatically download the library ⚡️`}
                </span>
            </Dialog>
        </>
    );
};

export default Header;
