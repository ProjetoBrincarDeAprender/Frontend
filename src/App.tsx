import { Route, Routes } from "react-router";
import Form from "./pages/Form/Form";
import { Home } from "./pages/Home/Home";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/cadastrar" element={<Form />} />
    </Routes>
  );
}

export default App;
