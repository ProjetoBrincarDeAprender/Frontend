import { Route, Routes } from "react-router";
import { Home } from "./pages/Home/Home";
import { Games } from "./pages/Games/Games";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/games" element={<Games />} />
    </Routes>
  );
}

export default App;
