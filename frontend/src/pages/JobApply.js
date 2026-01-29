import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function JobApply() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'candidate') {
      navigate('/login');
    }
  }, [navigate]);

  /* ================= FETCH JOB DETAILS ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        setMessage('Failed to load job details');
      }
    };
    fetchJob();
  }, [id]);

  /* ================= APPLY FOR JOB ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!resume) {
      setMessage('Please upload your resume');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', resume);

      const res = await API.post('/applications', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage(res.data.message || 'Application submitted');

      setTimeout(() => {
        navigate('/candidate');
      }, 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="apply-page">
      <h3>Apply for Job</h3>
      {/* ================= JOB DETAILS ================= */}
      <div className="job-card">
        <h2>{job.title}</h2>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p>{job.description}</p>

        {/* ================= APPLY FORM ================= */}
      <div className="apply-card">
        

        <form onSubmit={handleSubmit}>

          <br /><br />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />
          <br />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Now'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '10px', color: '#ffd700' ,width: '100%'}}>
            {message}
          </p>
        )}
      </div>


      </div>

      
    </div>
  );
}
