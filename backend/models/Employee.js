const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { 
    type: String, 
    required: true, 
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales'] 
  },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  avatar: { type: String, default: '' },
  joiningDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);