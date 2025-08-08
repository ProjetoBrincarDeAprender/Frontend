import { Navigate, Route, Routes } from "react-router";
import { AuthGuard } from "./guards/AuthGuard";
import { RegisterStudentPage } from "./pages/CadAluno/CadAluno";
import { RegisterSchoolPage } from "./pages/CadEscola/CadEscola";
import { RegisterProfessorPage } from "./pages/CadProfessor/CadProfessor";
import { RegisterResponsablePage } from "./pages/CadResponsavel/CadResponsavel";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { Students } from "./pages/Dashboard/Students/Students";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { EditStudentPage } from "./pages/EditAluno/EditAluno";
import { EditSchoolPage } from "./pages/EditEscola/EditEscola";
import { EditTeacherPage } from "./pages/EditProfessor/EditProfessor";
import { EditResponsablePage } from "./pages/EditResponsavel/EditResponsavel";
import { Games } from "./pages/Games/Games";
import { Home } from "./pages/Home/Home";
import { default as LoginForm } from "./pages/Login/Login";
import { Profile } from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/games" element={<Games />} />

      <Route element={<AuthGuard requireAuth role={["Admin", "Escola"]} />}>
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/school" element={<RegisterSchoolPage />} />
        <Route path="/register/teacher" element={<RegisterProfessorPage />} />
        <Route
          path="/register/responsable"
          element={<RegisterResponsablePage />}
        />
      </Route>

      <Route path="/edit/student/:id" element={<EditStudentPage />} />
      <Route path="/edit/school/:id" element={<EditSchoolPage />} />
      <Route path="/edit/teacher/:id" element={<EditTeacherPage />} />
      <Route path="/edit/responsable/:id" element={<EditResponsablePage />} />

      <Route
        path="/dashboard"
        element={<AuthGuard requireAuth role={["Admin", "Escola"]} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="schools" element={<Schools />} />
        <Route path="teachers" element={<Teachers />} />
      </Route>

      <Route element={<AuthGuard requireAuth />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
