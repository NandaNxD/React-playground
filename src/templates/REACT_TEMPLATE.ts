export const REACT_TEMPLATE = `
import React from "react";
import ReactDOM from "react-dom/client";
import './styles.css'

export function App() {
  return (
    <React.Fragment>
      <span>Hello</span>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;