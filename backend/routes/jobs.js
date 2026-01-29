const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/email');

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.pdf', '.doc', '.docx'].includes(ext)) {
    return cb(new Error('Only PDF/DOC/DOCX files allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');


// =================================================
// ================= JOB ROUTES ====================
// =================================================

/* ---------- GET ALL JOBS (PUBLIC) ---------- */
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- GET EMPLOYER JOBS (PRIVATE) ---------- */
router.get('/employer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({ employerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- GET JOB BY ID ---------- */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- POST JOB (EMPLOYER ONLY) ---------- */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const job = new Job({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary,
      employerId: req.user.id 
    });

    await job.save();
    res.status(201).json({ job });

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- APPLY FOR JOB ---------- */
router.post('/:id/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = new Application({
      jobId: job._id,
      candidateId: req.user.id,
      resumePath: req.file.path
    });

    await application.save();

    try {
      await sendEmail(
        req.user.email,
        `Application Submitted: ${job.title}`,
        `Hi ${req.user.name}, your application was submitted successfully.`
      );

      const employer = await User.findById(job.employerId);
      if (employer) {
        await sendEmail(
          employer.email,
          `New Application`,
          `${req.user.name} applied for "${job.title}".`
        );
      }
    } catch {
      console.log('Email failed but application saved');
    }

    res.json({ message: 'Application submitted successfully' });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already applied' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- GET APPLICATIONS FOR ONE JOB ---------- */
router.get('/:id/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers allowed' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate('candidateId', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------- UPDATE APPLICATION STATUS ---------- */
router.put('/applications/:appId/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers allowed' });
    }

    const { status } = req.body;
    const { appId } = req.params;

    if (!['shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(appId).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Status updated', application });

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
