import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        setError('Failed to load job details');
      }
    };
    fetchJob();
  }, [id]);

  if (error) return <p style={{ textAlign: 'center' }}>{error}</p>;
  if (!job) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="job-page">
      {/* ================= JOB DETAILS ================= */}
      <div className="job-card_apply">
        <h2 className="job-title">{job.title}</h2>

        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>

        <p className="job-desc"><strong>Description:</strong>{job.description}</p>
        

       {role === 'candidate' || !role ? (
        <button
          className="apply-button"
          onClick={() => {
            localStorage.setItem('redirectAfterLogin', `/jobs/${id}/apply`);
            navigate('/login');
          }}
        >
          Apply Now
        </button>
      ) : (
        <p style={{ color: 'red' }}>Employers cannot apply for jobs</p>
      )}

      <p style={{ marginTop: '12px', textAlign: 'center' }}>
            <Link to="/">← Back to Home</Link>
          </p>
      </div>

      
    </div>
  );
}
