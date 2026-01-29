import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jobs from './pages/jobs';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import EmployerApplications from './pages/EmployerApplications';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
            path="/jobs/:id/apply"
            element={
              <PrivateRoute role="candidate">
                <JobApply />
              </PrivateRoute>
            }
          />

        <Route
            path="/employer/applications"
            element={
              <PrivateRoute role="employer">
                <EmployerApplications />
              </PrivateRoute>
            }
          />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs" element={<Jobs />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/employer"
          element={
            <PrivateRoute role="employer">
              <EmployerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/candidate"
          element={
            <PrivateRoute role="candidate">
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/employer/applications/:jobId" element={<EmployerApplications />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
