import "./index.css";
import App from "./App";
import { render } from "solid-js/web";

const root = document.getElementById("root");
if (root) {
  render(() => <App />, root);
}
