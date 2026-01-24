import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LearningPathPage from './pages/LearningPathPage';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import ExercisePage from './pages/ExercisePage';
import LabPage from './pages/LabPage';
import LabsSelectionPage from './pages/LabsSelectionPage';
import { useUser } from './context/UserContext';

function App() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
