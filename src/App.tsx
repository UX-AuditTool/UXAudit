import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProjectOverviewPage from './pages/ProjectOverviewPage';
import FlowDetailPage from './pages/FlowDetailPage';
import PublicProjectView from './pages/PublicProjectView';
import DebugPage from './pages/DebugPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/projects/:projectId" element={<ProjectOverviewPage />} />
        <Route path="/projects/:projectId/flows/:flowId" element={<FlowDetailPage />} />
        <Route path="/view/:shareToken" element={<PublicProjectView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
