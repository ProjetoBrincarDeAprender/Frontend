import { Route, Routes } from "react-router";
import Form from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import { Games } from "./pages/Games/Games";
import { RegisterStudentPage } from './pages/CadAluno/CadAluno';
import { RegisterProfessorPage } from './pages/CadProfessor/CadProfessor';
import { RegisterResponsablePage } from './pages/CadResponsavel/CadResponsavel';
import { RegisterSchoolPage } from './pages/CadEscola/CadEscola';
import {EditStudentPage} from './pages/EditAluno/EditAluno';
import {EditSchoolPage} from './pages/EditEscola/EditEscola';
import {EditTeacherPage} from './pages/EditProfessor/EditProfessor';
import {EditResponsablePage} from './pages/EditResponsavel/EditResponsavel';


function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Form />} />

      <Route path="/games" element={<Games />} />
      
      <Route path="/cadastrar/aluno" element={<RegisterStudentPage/>}/>

      <Route path="/cadastrar/escola" element={<RegisterSchoolPage/>}/>

      <Route path="/cadastrar/professor" element={<RegisterProfessorPage/>}/>

      <Route path="/cadastrar/responsavel" element={<RegisterResponsablePage/>}/>

      <Route path="/editar/aluno" element={<EditStudentPage/>}/>

      <Route path="/editar/escola" element={<EditSchoolPage/>}/>

      <Route path="/editar/professor" element={<EditTeacherPage/>}/>

      <Route path="/editar/responsavel" element={<EditResponsablePage/>}/>

    </Routes>
  );
}

export default App;
