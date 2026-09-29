const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');

// Get All Employees
router.get('/', auth, async (req, res) => {
  try {
    const { search = '', department = '' } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json({ employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats API
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'Active' });
    const deptStats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    res.json({ total, active, deptStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Employee
router.post('/', auth, async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Employee
router.delete('/:id', auth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;