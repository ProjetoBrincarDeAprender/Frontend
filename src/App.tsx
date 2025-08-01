import { Navigate, Route, Routes } from "react-router";
import Form from "./pages/Form/Form";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Home } from "./pages/Home/Home";
import { Students } from "./pages/Dashboard/Students/Students";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { Profile } from "./pages/Profile/Profile";
import LoginForm from "./pages/Login/Login";
import { Games } from "./pages/Games/Games";
import { RegisterProfessorPage } from './pages/CadProfessor/CadProfessor';
import { RegisterStudentPage } from './pages/CadAluno/CadAluno';
import { RegisterSchoolPage } from './pages/CadEscola/CadEscola';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/cadastrar" element={<Form />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/games" element={<Games />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/students" element={<Students />} />
      <Route path="/dashboard/schools" element={<Schools />} />
      <Route path="/dashboard/teachers" element={<Teachers />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/cadastrar/professor" element={<RegisterProfessorPage/>}/>
      <Route path="/cadastrar/aluno" element={<RegisterStudentPage/>}/>
      <Route path="/cadastrar/escola" element={<RegisterSchoolPage/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
