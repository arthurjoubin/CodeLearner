import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import ExercisePage from './pages/ExercisePage';
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
          <Route path="/module/:moduleId" element={<ModulePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
