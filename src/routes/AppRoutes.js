// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskListView from '../views/TaskListView';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import PrivateRoute from '../components/PrivateRoute';
import AdminDashboard from '../views/AdminDashboard.jsx';
import TokenExpiryModal from '../components/TokenExpiryModal';
import { useAuth } from '../contexts/AuthContext';
import PrivateLayout from '../components/PrivateLayout';

function AppRoutes() {
  const { showExpiryWarning, setShowExpiryWarning } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route
          path="/tasks"
          element={
             <PrivateRoute>
                <PrivateLayout>
                  <TaskListView />
                </PrivateLayout>
             </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['Admin']}>
                <PrivateLayout>
                    <AdminDashboard />
                </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<LoginView />} />
      </Routes>
      <TokenExpiryModal show={showExpiryWarning}
                        onClose={() => setShowExpiryWarning(false)} />
    </Router>
  );
}

export default AppRoutes;



