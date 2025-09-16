import { Route, Routes } from "react-router";
import { AuthGuard } from "./guards/AuthGuard";
import Dashboard from "./pages/Dashboard/Admin/Dashboard";
import { Responsibles } from "./pages/Dashboard/Responsible/Responsibles";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { SchoolUsers } from "./pages/Dashboard/SchoolUsers/SchoolUsers";
import { Students } from "./pages/Dashboard/Students/Students";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { Games } from "./pages/Games/Games";
import { Home } from "./pages/Home/Home";
import { default as LoginForm } from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import { Profile } from "./pages/Profile/Profile";
import { LinkStudents } from "./pages/Dashboard/Teachers/LinkStudents/LinkStudents";
import { ResponsibleDashboard } from "./pages/Dashboard/Responsible/ResponsibleDashboard/ReponsibleDashboard";
import { NotFound } from "./pages/Errors/NotFound/NotFound";
import { Calm } from "./pages/Calm/Calm";
import VowelsGame from "./components/features/games/VowelsGame";
import NumbersGame from "./components/features/games/NumbersGame";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/games" element={<Games />} />

      {/* URL apenas de testes */}
      <Route path="/responsibledashboard" element={<ResponsibleDashboard />} />

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

      <Route path="/games">
        <Route path="vowels" element={<VowelsGame />} />
        <Route path="numbers" element={<NumbersGame />} />
      </Route>

      <Route element={<AuthGuard requireAuth />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/calm" element={<Calm />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
