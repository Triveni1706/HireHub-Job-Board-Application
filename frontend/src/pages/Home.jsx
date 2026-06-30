import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo"><bold>Job Board</bold></div>
        <ul className="navbar-links">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="home-content">
        <h1>Welcome to Job Board</h1>
        <p>Find jobs or hire talented candidates easily.</p>
      </div>

      {/* Job Listings */}
      <div className="job-list">
        <h2>Latest Jobs</h2>
        <div className="jobs-container">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location: </strong>{job.location} </p>
              <p><strong>Salary:</strong> {job.salary}</p>

              <Link to={`/jobs/${job._id}`} className="view-btn">
                View Details
              </Link>
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
