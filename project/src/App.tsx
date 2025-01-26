import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

function PrivateRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (user.role.toLocaleLowerCase() !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute allowedRole="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <PrivateRoute allowedRole="teacher">
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>

    </AuthProvider>
  );
};

export default App;