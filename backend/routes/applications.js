const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.pdf', '.doc', '.docx'].includes(ext)) {
    return cb(new Error('Only PDF/DOC/DOCX files allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/* =================================================
   APPLY FOR JOB (CANDIDATE)
================================================= */
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID missing' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = new Application({
      jobId,
      candidateId: req.user.id,
      resumePath: req.file.path,
      status: 'applied'
    });

    await application.save();

    res.json({ message: 'Application submitted successfully' });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }
    console.error('APPLY ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =================================================
   CANDIDATE APPLICATIONS
================================================= */
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates allowed' });
    }

    const applications = await Application.find({
      candidateId: req.user.id
    })
      .populate('jobId', 'title location salary')
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    console.error('CANDIDATE APPS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =================================================
   EMPLOYER APPLICATIONS (IMPORTANT)
================================================= */
router.get('/employer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers allowed' });
    }

    const jobs = await Job.find({ employerId: req.user.id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds }
    })
      .populate('candidateId', 'name email')
      .populate('jobId', 'title location salary')
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    console.error('EMPLOYER APPS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =================================================
   UPDATE APPLICATION STATUS (EMPLOYER)
================================================= */
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers allowed' });
    }

    const { status } = req.body;

    if (!['applied', 'shortlisted', 'hired', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('candidateId', 'name email')
      .populate('jobId', 'title');

    res.json(application);

  } catch (err) {
    console.error('STATUS UPDATE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
