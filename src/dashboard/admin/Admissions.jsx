import { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaEye, FaFilter, FaTrash, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getAdmissions, updateAdmission, deleteAdmission } from '../../services/admissionService';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await getAdmissions(params);
      setAdmissions(res.data.admissions || []);
      setStats(res.stats || { pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      console.error(err);
      // Fallback to empty if API fails (e.g. no courses seeded yet)
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdmissions();
  };

  const handleApprove = async (id, name) => {
    const result = await Swal.fire({
      title: 'Approve Application?',
      html: `Approve <strong>${name}</strong> and create student account?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve'
    });

    if (!result.isConfirmed) return;

    setActionLoading(id);
    try {
      const res = await updateAdmission(id, { status: 'approved' });
      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        html: `
          <p>Student account created successfully.</p>
          <p class="mt-2"><strong>Student ID:</strong> ${res.data.student?.studentId || 'Generated'}</p>
          <p class="text-sm text-gray-500 mt-1">Default password is the student's phone number.</p>
        `,
        confirmButtonColor: '#0F4C81'
      });
      fetchAdmissions();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not approve application.',
        confirmButtonColor: '#0F4C81'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, name) => {
    const { value: remarks } = await Swal.fire({
      title: 'Reject Application?',
      input: 'text',
      inputLabel: `Reason for rejecting ${name}`,
      inputPlaceholder: 'Optional remarks...',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Reject'
    });

    if (remarks === undefined) return; // cancelled

    setActionLoading(id);
    try {
      await updateAdmission(id, { status: 'rejected', remarks: remarks || 'Application rejected' });
      Swal.fire({
        icon: 'success',
        title: 'Rejected',
        text: 'Application has been rejected.',
        confirmButtonColor: '#0F4C81'
      });
      fetchAdmissions();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Could not reject application.',
        confirmButtonColor: '#0F4C81'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Application?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdmission(id);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
      fetchAdmissions();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete.' });
    }
  };

  const handleView = (app) => {
    Swal.fire({
      title: app.applicationId,
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Name:</strong> ${app.studentName}</p>
          <p><strong>Father:</strong> ${app.fatherName}</p>
          <p><strong>Mother:</strong> ${app.motherName}</p>
          <p><strong>Phone:</strong> ${app.phone}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Gender:</strong> ${app.gender}</p>
          <p><strong>Education:</strong> ${app.education}</p>
          <p><strong>Address:</strong> ${app.address}</p>
          <p><strong>Course:</strong> ${app.course?.title || 'N/A'}</p>
          <p><strong>Status:</strong> ${app.status}</p>
          <p><strong>Applied:</strong> ${new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</p>
          ${app.remarks ? `<p><strong>Remarks:</strong> ${app.remarks}</p>` : ''}
        </div>
      `,
      confirmButtonColor: '#0F4C81',
      width: 500
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Admissions</h1>
        <p className="text-gray-500 text-sm">Review and manage online admission applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </form>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="text-2xl text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-5 py-3.5 font-medium">Application ID</th>
                  <th className="px-5 py-3.5 font-medium">Name</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Phone</th>
                  <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Course</th>
                  <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admissions.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 font-mono text-xs text-primary font-semibold">{app.applicationId}</td>
                    <td className="px-5 py-3.5 font-medium text-dark">{app.studentName}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{app.phone}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{app.course?.title || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(app)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition"
                          title="View"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app._id, app.studentName)}
                              disabled={actionLoading === app._id}
                              className="p-2 rounded-lg text-gray-400 hover:text-success hover:bg-success/10 transition disabled:opacity-50"
                              title="Approve"
                            >
                              {actionLoading === app._id ? <FaSpinner className="text-sm animate-spin" /> : <FaCheck className="text-sm" />}
                            </button>
                            <button
                              onClick={() => handleReject(app._id, app.studentName)}
                              disabled={actionLoading === app._id}
                              className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition disabled:opacity-50"
                              title="Reject"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition"
                          title="Delete"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && admissions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No applications found</p>
            <p className="text-xs mt-1">Applications submitted from the public form will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;
