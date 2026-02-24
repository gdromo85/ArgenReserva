import { Route, Routes } from "react-router-dom";
import Panel from "./layout/Panel";
import Login from "./layout/Login";

const App = () => {
  console.log("123456")
  console.log(import.meta.env.BASE_URL)
  //var strServidor = import.meta.env.BASE_URL 
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/panel" element={<Panel />}></Route>
    </Routes>
  );
};

export default App;
