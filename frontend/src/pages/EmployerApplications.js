import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function EmployerApplications() {
  const { jobId } = useParams(); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH APPLICATIONS FOR THIS JOB ================= */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/jobs/${jobId}/applications`);
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}/status`, { status });

      setApplications(prev =>
        prev.map(app =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="dashboard-applications">
      <h2>Applications for this Job</h2>

      {applications.length > 0 ? (
        applications.map(app => (
          <div key={app._id} className="applications-card">
            <h4>{app.jobId?.title}</h4>

            <p><strong>Candidate:</strong> {app.candidateId?.name}</p>
            <p><strong>Email:</strong> {app.candidateId?.email}</p>

            <p>
              <strong>Status:</strong>{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {app.status || 'applied'}
              </span>
            </p>

            

            <div style={{ marginTop: '10px' }}>
              <button onClick={() => updateStatus(app._id, 'shortlisted')}>
                Shortlist
              </button>
              <button onClick={() => updateStatus(app._id, 'hired')}>
                Hire
              </button>
              <button onClick={() => updateStatus(app._id, 'rejected')}>
                Reject
              </button>
            </div>

            {app.resumePath && (
              <div className='resume'>
              <button >
                <a 
                  href={`http://localhost:5000/${app.resumePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Resume
                </a>
              </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No applications for this job yet</p>
      )}
    </div>
  );
}
