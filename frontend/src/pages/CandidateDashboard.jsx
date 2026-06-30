import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  /* ================= FETCH ALL JOBS ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get('/jobs');
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  /* ================= FETCH CANDIDATE APPLICATIONS ================= */
  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get('/applications');
      setApplications(res.data);

      const ids = res.data.map(app => app.jobId?._id);
      setAppliedJobIds(ids);
    };
    fetchApplications();
  }, []);

  return (
    <div className="dashboard-page">
      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <h2>Welcome, {name}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="applicant-sections">
          {/* ================= YOUR APPLICATIONS ================= */}
          <h3>Your Applications</h3>
          <div className="applications-section">

            {applications.filter(app => app.jobId).length > 0 ? (
              applications
                .filter(app => app.jobId)
                .map(app => {

                  return (
                    <div key={app._id} className="application-card">
                      <div className='app-card'>
                      <h4>{app.jobId.title}</h4>
                      <p><strong>Location:</strong> {app.jobId.location}</p>
                      <p><strong>Salary:</strong> {app.jobId.salary}</p>

                      

                      {/* ===== STATUS BELOW RESUME ===== */}
                      <p style={{ marginTop: '8px' }}>
                        <strong>Status:</strong>{' '}
                        <span style={{ textTransform: 'capitalize' }}>
                          {app.status || 'applied'}
                        </span>
                      </p>
                      
                      {/* ===== DOWNLOAD RESUME FIRST ===== */}
                      {app.resumePath && (
                        <button>
                          <a className='resume'
                            href={`http://localhost:5000/${app.resumePath}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download Resume
                          </a>
                        </button>
                      )}

                      </div>
                    </div>
                  );
                })
            ) : (
              <p>No applications yet</p>
            )}

          </div>
        </div>

        <div className="jobs-section">
          {/* ================= AVAILABLE JOBS ================= */}
          <h3>Available Jobs</h3>

          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job._id} className="job-card">
                <h4>{job.title}</h4>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>

                {appliedJobIds.includes(job._id) ? (
                  <button disabled className="applied-btn">
                    Applied
                  </button>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={() => navigate(`/jobs/${job._id}/apply`)}
                  >
                    Apply
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No jobs available</p>
          )}
        </div>
      </div>
    </div>
  );
}
