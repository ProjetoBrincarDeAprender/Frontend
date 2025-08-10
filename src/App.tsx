import { Navigate, Route, Routes } from "react-router";
import { AuthGuard } from "./guards/AuthGuard";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Responsibles } from "./pages/Dashboard/Responsible/Responsibles";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { Students } from "./pages/Dashboard/Students/Students";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { Games } from "./pages/Games/Games";
import { Home } from "./pages/Home/Home";
import { default as LoginForm } from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import { Profile } from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/games" element={<Games />} />

      <Route
        path="/dashboard"
        element={<AuthGuard requireAuth role={["Admin", "Escola"]} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route element={<AuthGuard requireAuth role={["Admin"]} />}>
          <Route path="schools" element={<Schools />} />
        </Route>
        <Route path="teachers" element={<Teachers />} />
        <Route path="responsables" element={<Responsibles />} />
      </Route>

      <Route element={<AuthGuard requireAuth />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
