const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['employer', 'candidate'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
