export const REACT_TEMPLATE=`
import React from "react";
import ReactDOM from "react-dom/client";

const App=()=><h2>Hello React</h2>;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`