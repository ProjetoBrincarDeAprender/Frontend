import { Route, Routes } from "react-router";
import { MemoryGame } from "./components/features/games/MemoryGame";
import NumbersGame from "./components/features/games/NumbersGame";
import SumGame from "./components/features/games/SumGame";
import VowelsGame from "./components/features/games/VowelsGame";
import { AuthGuard } from "./guards/AuthGuard";
import { Calm } from "./pages/Calm/Calm";
import Dashboard from "./pages/Dashboard/Admin/Dashboard";
import { ResponsibleDashboard } from "./pages/Dashboard/Responsible/ResponsibleDashboard/ReponsibleDashboard";
import TeacherDashboard from "./pages/Dashboard/Teachers/TeacherDashboard/TeacherDashboard";
import { Responsibles } from "./pages/Dashboard/Responsible/Responsibles";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { SchoolUsers } from "./pages/Dashboard/SchoolUsers/SchoolUsers";
import { Students } from "./pages/Dashboard/Students/Students";
import { LinkStudents } from "./pages/Dashboard/Teachers/LinkStudents/LinkStudents";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { NotFound } from "./pages/Errors/NotFound/NotFound";
import { Games } from "./pages/Games/Games";
import { Home } from "./pages/Home/Home";
import { default as LoginForm } from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import { Profile } from "./pages/Profile/Profile";
import { RecoverPassword } from "./pages/RecoverPassword/RecoverPassword";
import { SendPasswordToken } from "./pages/SendPasswordToken/SendPasswordToken";
import KnowledgeAreas from "./pages/Dashboard/Teacher/Curriculum/KnowledgeAreas";
import {Competencies} from "./pages/Dashboard/Teacher/Curriculum/Competencies";
import {Activities} from "./pages/Dashboard/Teacher/Curriculum/Activities";
import {DifficultyLevels} from "./pages/Dashboard/Teacher/Curriculum/DifficultyLevels";
import { Questions } from "./pages/Dashboard/Teacher/Curriculum/Questions";


function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/get-password-token" element={<SendPasswordToken />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

      {/* URL apenas de testes */}
      <Route path="/responsibledashboard" element={<ResponsibleDashboard />} />
      <Route path="/teacherdashboard" element={<TeacherDashboard />} />

      <Route
        path="/dashboard"
        element={<AuthGuard requireAuth role={["Admin", "Escola"]} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route element={<AuthGuard requireAuth role={["Admin"]} />}>
          <Route path="schools" element={<Schools />} />
          <Route path="schoolusers" element={<SchoolUsers />} />
        </Route>
        <Route path="teachers" element={<Teachers />} />
        <Route path="link-students" element={<LinkStudents />} />
        <Route path="responsables" element={<Responsibles />} />
      </Route>

      {/* Rotas específicas do Professor */}
      <Route
        path="/dashboard/teacher"
        element={<AuthGuard requireAuth role={["Professor"]} />}
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="curriculum/knowledge-areas" element={<KnowledgeAreas />} />
        <Route path="curriculum/competences" element={<Competencies />} />
        <Route path="curriculum/activities" element={<Activities />} />
        <Route path="curriculum/difficulty-levels" element={<DifficultyLevels />} />
        <Route path="curriculum/questions" element={<Questions />} />
      </Route>

      <Route path="/games">
        <Route index element={<Games />} />
        <Route path="vowels" element={<VowelsGame />} />
        <Route path="memory" element={<MemoryGame />} />
        <Route path="sum" element={<SumGame />} />
        <Route path="numbers" element={<NumbersGame />} />
      </Route>

      <Route element={<AuthGuard requireAuth />}>
        <Route path="/profile">
          <Route index element={<Profile />} />
        </Route>
        <Route path="/calm" element={<Calm />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
