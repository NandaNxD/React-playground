export const REACT_TEMPLATE = `
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "1.5rem",
        fontFamily: "monospace",
        gap: "20px",
      }}
    >
      <span>Playground</span>
      <img
        src="https://www.techvoot.com/storage/blogs/meta-image/768794_Animate-3D-Model-Using-Three-META.jpg"
        style={{ width: "100%", height: "300px", borderRadius: "8px" }}
        alt="three-js-image"
      ></img>
      <img
        src="https://cdn.mos.cms.futurecdn.net/TevcTWBs4w9qSeAJyRw2RA-1200-80.jpg"
        style={{ width: "100%", height: "300px", borderRadius: "8px" }}
        alt="uber-image"
      ></img>
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


`;