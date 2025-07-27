import { Route, Routes } from "react-router";
import Form from "./pages/Form/Form";
import { Home } from "./pages/Home/Home";
import { Games } from "./pages/Games/Games";
import { RegisterProfessorPage } from './pages/CadProfessor/CadProfessor';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/cadastrar" element={<Form />} />

      <Route path="/games" element={<Games />} />
      
      <Route path="/cadprofessor" element={<RegisterProfessorPage/>}/>
    </Routes>
  );
}

export default App;
