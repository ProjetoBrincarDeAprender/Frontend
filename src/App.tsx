import { Navigate, Route, Routes } from "react-router";
import Form from "./pages/Form/Form";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Home } from "./pages/Home/Home";
import { Students } from "./pages/Dashboard/Students/Students";
import { Profile } from "./pages/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/cadastrar" element={<Form />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/students" element={<Students />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
