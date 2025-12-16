import { Route, Routes } from "react-router";

import { AuthGuard } from "./guards/AuthGuard";
import { Calm } from "./pages/Calm/Calm";
import Dashboard from "./pages/Dashboard/Admin/Dashboard";
import { ResponsibleDashboard } from "./pages/Dashboard/Responsible/ResponsibleDashboard/ReponsibleDashboard";
import { Responsibles } from "./pages/Dashboard/Responsible/Responsibles";
import { Schools } from "./pages/Dashboard/Schools/Schools";
import { SchoolUsers } from "./pages/Dashboard/SchoolUsers/SchoolUsers";
import { Students } from "./pages/Dashboard/Students/Students";
import { Activities } from "./pages/Dashboard/Teacher/Curriculum/Activities";
import { Competencies } from "./pages/Dashboard/Teacher/Curriculum/Competencies";
import { DifficultyLevels } from "./pages/Dashboard/Teacher/Curriculum/DifficultyLevels";
import KnowledgeAreas from "./pages/Dashboard/Teacher/Curriculum/KnowledgeAreas";
import { Questions } from "./pages/Dashboard/Teacher/Curriculum/Questions";
import { LinkStudents } from "./pages/Dashboard/Teachers/LinkStudents/LinkStudents";
import TeacherDashboard from "./pages/Dashboard/Teachers/TeacherDashboard/TeacherDashboard";
import { Teachers } from "./pages/Dashboard/Teachers/Teachers";
import { NotFound } from "./pages/Errors/NotFound/NotFound";
import { Games } from "./pages/Games/Games";
import { Home } from "./pages/Home/Home";
import { default as LoginForm } from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import { Profile } from "./pages/Profile/Profile";
import { RecoverPassword } from "./pages/RecoverPassword/RecoverPassword";
import { SendPasswordToken } from "./pages/SendPasswordToken/SendPasswordToken";
import { UserPerfilEnum } from "./types/user";
import CreateActivityPage from "./pages/ActivitiesPage/CreateActivityPage";
import { GameFactory } from "./components/features/games/GameFactory";
import { GameWrapper } from "./components/features/games/GameWrapper";

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
        element={
          <AuthGuard
            requireAuth
            role={[UserPerfilEnum.ADMIN, UserPerfilEnum.SCHOOL_ADMIN]}
          />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route
          element={<AuthGuard requireAuth role={[UserPerfilEnum.ADMIN]} />}
        >
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
        element={
          <AuthGuard
            requireAuth
            role={[UserPerfilEnum.TEACHER, UserPerfilEnum.ADMIN]}
          />
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="curriculum/knowledge-areas" element={<KnowledgeAreas />} />
        <Route path="curriculum/competences" element={<Competencies />} />
        <Route path="curriculum/activities" element={<Activities />} />
        <Route
          path="curriculum/difficulty-levels"
          element={<DifficultyLevels />}
        />
        <Route path="curriculum/questions" element={<Questions />} />
        <Route
          path="curriculum/activities/create"
          element={<CreateActivityPage />}
        ></Route>
      </Route>

      <Route path="/games" element={<AuthGuard />}>
        <Route index element={<Games />} />
        <Route path="address" element={<GameWrapper gameConfig={GameFactory.createAddressGame()} />} />
        <Route path="armed-sum" element={<GameWrapper gameConfig={GameFactory.createArmedSumGame()} />} />
        <Route path="com-dates" element={<GameWrapper gameConfig={GameFactory.createComDatesGame()} />} />
        <Route path="complex-syllable" element={<GameWrapper gameConfig={GameFactory.createComplexSyllableGame()} />} />
        <Route path="forms" element={<GameWrapper gameConfig={GameFactory.createCoordinationGame()} />} />
        <Route path="housing" element={<GameWrapper gameConfig={GameFactory.createHousingGame()} />} />
        <Route path="hygiene" element={<GameWrapper gameConfig={GameFactory.createHygieneGame()} />} />
        <Route path="locations" element={<GameWrapper gameConfig={GameFactory.createLocationsGame()} />} />
        <Route path="maze" element={<GameWrapper gameConfig={GameFactory.createMazeGame()} />} />
        <Route path="memory" element={<GameWrapper gameConfig={GameFactory.createMemoryGame()} />} />
        <Route path="numbers" element={<GameWrapper gameConfig={GameFactory.createNumbersGame()} />} />
        <Route path="plants" element={<GameWrapper gameConfig={GameFactory.createPlantsGame()} />} />
        <Route path="professions" element={<GameWrapper gameConfig={GameFactory.createProfessionsGame()} />} />
        <Route path="punctuation" element={<GameWrapper gameConfig={GameFactory.createPunctuationGame()} />} />
        <Route path="sensorial" element={<GameWrapper gameConfig={GameFactory.createSensorialGame()} />} />
        <Route path="simple-syllable" element={<GameWrapper gameConfig={GameFactory.createSimpleSyllableGame()} />} />
        <Route path="space" element={<GameWrapper gameConfig={GameFactory.createSpaceGame()} />} />
        <Route path="stresssyllable" element={<GameWrapper gameConfig={GameFactory.createStressSyllableGame()} />} />
        <Route path="subtraction" element={<GameWrapper gameConfig={GameFactory.createSubtractionGame()} />} />
        <Route path="sum" element={<GameWrapper gameConfig={GameFactory.createSumGame()} />} />
        <Route path="syllable" element={<GameWrapper gameConfig={GameFactory.createSyllableGame()} />} />
        <Route path="syllable-division" element={<GameWrapper gameConfig={GameFactory.createSyllableDivisionGame()} />} />
        <Route path="use-syllable" element={<GameWrapper gameConfig={GameFactory.createUseSyllableGame()} />} />
        <Route path="vowels" element={<GameWrapper gameConfig={GameFactory.createVowelsGame()} />} />
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
