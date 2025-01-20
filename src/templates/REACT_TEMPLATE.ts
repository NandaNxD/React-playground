export const REACT_TEMPLATE = 
`
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
        gap:'20px'
      }}
    >
      <span>Playground</span>
      <img
        src="https://dianapps.com/blog/wp-content/uploads/2022/12/1080600.png"
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