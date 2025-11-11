import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Nas from "./pages/Nas";
import Files from "./pages/Files";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/nas" element={<Nas />}></Route>
      <Route path="/nas/files" element={<Files />}></Route>
    </Routes>
  </BrowserRouter>
);
