import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search
  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <div className="container">
      <h2>Available Jobs</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by job title or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br /><br />

      {/* Jobs List */}
      <h2>Job Listings</h2>

      {filteredJobs.length > 0 ? (
        <div className="jobs-container">
          {filteredJobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>

              <Link to={`/jobs/${job._id}`}>
                View Details / Apply
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
}
