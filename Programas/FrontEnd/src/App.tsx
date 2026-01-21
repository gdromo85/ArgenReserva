import { BrowserRouter, Route, Routes } from "react-router-dom";
import Panel from "./layout/Panel";
import Login from "./layout/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/panel" element={<Panel />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
