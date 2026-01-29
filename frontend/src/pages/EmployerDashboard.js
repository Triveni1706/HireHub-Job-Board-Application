import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [message, setMessage] = useState('');

  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  /* ---------- FETCH JOBS ---------- */
  useEffect(() => {
    fetch('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setJobs);
  }, [token]);

  /* ---------- FETCH APPLICATIONS ---------- */
  useEffect(() => {
  fetch('http://localhost:5000/api/applications/employer', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const grouped = {};

      data.forEach(app => {
        const jobId = app.jobId._id;
        if (!grouped[jobId]) grouped[jobId] = [];
        grouped[jobId].push(app);
      });

      setApplications(grouped);
    });
}, [token]);
  /* ---------- UPDATE APPLICATION STATUS ---------- */

const updateStatus = async (appId, status) => {
  try {
    await fetch(
      `http://localhost:5000/api/jobs/applications/${appId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    setApplications(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(jobId => {
        updated[jobId] = updated[jobId].map(app =>
          app._id === appId ? { ...app, status } : app
        );
      });
      return updated;
    });

  } catch (err) {
    alert('Failed to update status');
  }
};


  /* ---------- ADD JOB ---------- */
  const handleAddJob = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !salary) {
      setMessage('Please fill all fields');
      return;
    }

    const res = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, location, salary })
    });

    const data = await res.json();

    if (data.job) {
      setJobs(prev => [...prev, data.job]);
      setMessage('Job posted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setSalary('');
    }
  };

  /* ---------- DELETE JOB ---------- */
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      setJobs(prev => prev.filter(job => job._id !== jobId));
      setMessage('Job deleted successfully');
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome, {name}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Add Job */}
      <div className="card">
        <h3>Post a New Job</h3>
        <form className="job-form" onSubmit={handleAddJob}>
          <input
            placeholder="Job Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />

          <input
            placeholder="Salary"
            value={salary}
            onChange={e => setSalary(e.target.value)}
            required
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
          />
          <button type="submit">Add Job</button>
        </form>
        {message && <p className="success-msg">{message}</p>}
      </div>

      {/* Job Listings */}
      <h3>Your Job Postings</h3>
      <div className="jobs-container">
      {jobs.length > 0 ? jobs.map(job => (
        <div key={job._id} className="job-card">
          <div className="job-header">
            <h4>{job.title}</h4>
            <button
              className="delete-btn"
              onClick={() => handleDeleteJob(job._id)}>
              Delete
            </button>
          </div>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
        
          <h5>Applications</h5>

          <button onClick={() => navigate(`/employer/applications/${job._id}`)}>
            View Applications
          </button>


        </div>
        )) : (
        <p className="empty-text">No jobs posted yet</p>
        )}
      </div>
    </div>
  );
}
