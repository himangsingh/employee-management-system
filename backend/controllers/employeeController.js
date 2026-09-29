const Employee = require('../models/Employee');

// Get All Employees with Search, Filter & Pagination
exports.getEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;

    let query = {};

    // Search by Name or Email or EmployeeID
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by Department & Status
    if (department) query.department = department;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalEmployees: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};