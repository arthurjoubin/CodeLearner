import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LearningPathPage from './pages/LearningPathPage';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import ExercisePage from './pages/ExercisePage';
import LabPage from './pages/LabPage';
import LabsSelectionPage from './pages/LabsSelectionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HelpPage from './pages/HelpPage';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learning-path/:pathId" element={<LearningPathPage />} />
          <Route path="/module/:moduleId" element={<ModulePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
          <Route path="/labs" element={<LabsSelectionPage />} />
          <Route path="/labs/:labId" element={<LabPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
