import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Users,
  UserCheck,
  Building,
} from "lucide-react";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, deptStats: [] });
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "IT",
    designation: "",
    salary: "",
    status: "Active",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees?search=${search}&department=${department}`,
        config,
      );
      setEmployees(res.data.employees);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees/stats/summary",
        config,
      );
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, [search, department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees", formData, config);
      setIsModalOpen(false);
      fetchEmployees();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving employee");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, config);
      fetchEmployees();
      fetchStats();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Employee Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Manage staff records, roles, and status
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Staff</p>
            <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Active Members</p>
            <h3 className="text-2xl font-bold text-white">{stats.active}</h3>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/60 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Building size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Departments</p>
            <h3 className="text-2xl font-bold text-white">
              {stats.deptStats.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/60 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-3 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700/60 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-700/60">
            <tr>
              <th className="p-4">Emp ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-slate-700/20 transition">
                <td className="p-4 font-mono text-slate-400">
                  {emp.employeeId}
                </td>
                <td className="p-4 font-medium text-white">{emp.name}</td>
                <td className="p-4">{emp.department}</td>
                <td className="p-4">{emp.designation}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Add New Employee
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Emp ID (e.g. EMP101)"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
              <input
                type="text"
                placeholder="Designation"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Salary"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
