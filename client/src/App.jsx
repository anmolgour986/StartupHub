import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import StartupDetail from './pages/StartupDetail';
import CreateEditStartup from './pages/CreateEditStartup';
import MyStartups from './pages/MyStartups';
import Applications from './pages/Applications';
import MyApplications from './pages/MyApplications';
import Team from './pages/Team';
import Tasks from './pages/Tasks';
import MyTasks from './pages/MyTasks';
import Chat from './pages/Chat';
import Files from './pages/Files';
import Milestones from './pages/Milestones';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard (protected) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/startups/new" element={<CreateEditStartup />} />
          <Route path="/startups/:id/edit" element={<CreateEditStartup />} />
          <Route path="/startups/:id" element={<StartupDetail />} />
          <Route path="/startups/:id/applications" element={<Applications />} />
          <Route path="/startups/:id/team" element={<Team />} />
          <Route path="/startups/:id/tasks" element={<Tasks />} />
          <Route path="/startups/:id/files" element={<Files />} />
          <Route path="/startups/:id/milestones" element={<Milestones />} />
          <Route path="/startups/:id/chat" element={<Chat />} />
          <Route path="/my-startups" element={<MyStartups />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
