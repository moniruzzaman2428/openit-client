import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter,
  FaTrash,
  FaSpinner,
  FaUsers,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaCalendarAlt,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

import {
  getAdmissions,
  getAdmissionBatches,
  updateAdmission,
  deleteAdmission,
} from '../../services/admissionService';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [actionLoading, setActionLoading] = useState(null);
  const [batchLoading, setBatchLoading] = useState(null);

  // =========================================================
  // FETCH ADMISSIONS
  // =========================================================
  const fetchAdmissions = async () => {
    setLoading(true);

    try {
      const params = {
        limit: 500,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await getAdmissions(params);

      setAdmissions(res?.data?.admissions || []);

      setStats(
        res?.stats || {
          pending: 0,
          approved: 0,
          rejected: 0,
        }
      );
    } catch (err) {
      console.error('Fetch admissions error:', err);

      setAdmissions([]);

      Swal.fire({
        icon: 'error',
        title: 'Failed to load',
        text:
          err?.response?.data?.message ||
          'Could not load admission applications.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  // =========================================================
  // SEARCH
  // =========================================================
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdmissions();
  };

  // =========================================================
  // GET BATCHES FOR COURSE
  // =========================================================
  const fetchBatchesForCourse = async (courseId) => {
    if (!courseId) {
      throw new Error('Course information is missing.');
    }

    const res = await getAdmissionBatches(courseId);

    /*
      Your backend response may be one of these:

      {
        success: true,
        data: {
          batches: [...]
        }
      }

      OR

      {
        success: true,
        batches: [...]
      }

      So we support both.
    */

    const batches =
      res?.data?.batches ||
      res?.batches ||
      res?.data?.data?.batches ||
      [];

    return batches;
  };

  // =========================================================
  // APPROVE APPLICATION
  // =========================================================
  const handleApprove = async (app) => {
    const id = app._id;
    const name = app.studentName;
    const courseId = app.course?._id;

    if (!courseId) {
      Swal.fire({
        icon: 'error',
        title: 'Course Missing',
        text: 'This admission does not have a valid course assigned.',
        confirmButtonColor: '#0F4C81',
      });

      return;
    }

    setBatchLoading(id);

    try {
      // -----------------------------------------------------
      // FETCH COURSE BATCHES
      // -----------------------------------------------------
      const batches = await fetchBatchesForCourse(courseId);

      setBatchLoading(null);

      // -----------------------------------------------------
      // NO BATCH FOUND
      // -----------------------------------------------------
      if (!batches.length) {
        await Swal.fire({
          icon: 'warning',
          title: 'No Available Batch',
          html: `
            <div style="text-align:left">
              <p style="margin-bottom:10px;">
                No available batch was found for:
              </p>

              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:12px;
              ">
                <strong>${app.course?.title || 'Selected Course'}</strong>
              </div>

              <p style="
                margin-top:12px;
                color:#64748b;
                font-size:13px;
              ">
                Please create an upcoming/ongoing batch and assign a teacher
                before approving this student.
              </p>
            </div>
          `,
          confirmButtonColor: '#0F4C81',
        });

        return;
      }

      // -----------------------------------------------------
      // CREATE BATCH OPTIONS
      // -----------------------------------------------------
      const batchOptions = batches
        .map((batch) => {
          const currentStudents = Number(batch.currentStudents || 0);
          const maximumStudents = Number(batch.maximumStudents || 0);

          const remainingSeats = Math.max(
            maximumStudents - currentStudents,
            0
          );

          const teacherName =
            batch.teacher?.name ||
            batch.teacherName ||
            'Teacher not assigned';

          const status =
            batch.status === 'ongoing'
              ? 'Ongoing'
              : batch.status === 'upcoming'
              ? 'Upcoming'
              : batch.status || 'Unknown';

          const startDate = batch.startDate
            ? new Date(batch.startDate).toLocaleDateString()
            : '';

          return {
            ...batch,
            _currentStudents: currentStudents,
            _maximumStudents: maximumStudents,
            _remainingSeats: remainingSeats,
            _teacherName: teacherName,
            _statusLabel: status,
            _startDate: startDate,
          };
        })
        .filter((batch) => {
          /*
            Only allow batches that have available seats.
          */
          return (
            batch._maximumStudents <= 0 ||
            batch._currentStudents < batch._maximumStudents
          );
        });

      // -----------------------------------------------------
      // NO AVAILABLE SEAT
      // -----------------------------------------------------
      if (!batchOptions.length) {
        await Swal.fire({
          icon: 'warning',
          title: 'All Batches Are Full',
          html: `
            <p style="color:#64748b;">
              All batches for <strong>${app.course?.title || 'this course'}</strong>
              have reached their maximum capacity.
            </p>
          `,
          confirmButtonColor: '#0F4C81',
        });

        return;
      }

      // -----------------------------------------------------
      // CREATE HTML OPTIONS
      // -----------------------------------------------------
      const optionsHtml = batchOptions
        .map((batch, index) => {
          const teacherAvailable =
            batch.teacher || batch.teacherName
              ? true
              : false;

          const seatsText =
            batch._maximumStudents > 0
              ? `${batch._currentStudents}/${batch._maximumStudents} students • ${batch._remainingSeats} seat${
                  batch._remainingSeats !== 1 ? 's' : ''
                } left`
              : `${batch._currentStudents} students`;

          const teacherText = teacherAvailable
            ? batch._teacherName
            : 'No teacher assigned';

          const disabled = !teacherAvailable ? 'disabled' : '';

          return `
            <option
              value="${batch._id}"
              ${disabled}
            >
              ${batch.name || batch.batchName || `Batch ${index + 1}`}
              — ${batch._statusLabel}
              — ${teacherText}
              — ${seatsText}
              ${batch._startDate ? `— Starts ${batch._startDate}` : ''}
            </option>
          `;
        })
        .join('');

      // -----------------------------------------------------
      // BATCH SELECTION
      // -----------------------------------------------------
      const result = await Swal.fire({
        title: 'Select Student Batch',

        html: `
          <div style="text-align:left">

            <div style="
              display:flex;
              align-items:center;
              gap:12px;
              background:#eff6ff;
              border:1px solid #bfdbfe;
              border-radius:14px;
              padding:14px;
              margin-bottom:18px;
            ">
              <div style="
                width:42px;
                height:42px;
                border-radius:12px;
                background:#dbeafe;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#0F4C81;
                font-size:18px;
                flex-shrink:0;
              ">
                🎓
              </div>

              <div>
                <div style="
                  font-size:12px;
                  color:#64748b;
                  margin-bottom:3px;
                ">
                  Student
                </div>

                <div style="
                  font-weight:700;
                  color:#0f172a;
                  font-size:15px;
                ">
                  ${name}
                </div>

                <div style="
                  font-size:12px;
                  color:#64748b;
                  margin-top:2px;
                ">
                  ${app.applicationId || ''}
                </div>
              </div>
            </div>

            <div style="
              background:#f8fafc;
              border:1px solid #e2e8f0;
              border-radius:12px;
              padding:12px 14px;
              margin-bottom:15px;
            ">
              <div style="
                font-size:11px;
                color:#64748b;
                margin-bottom:4px;
              ">
                COURSE
              </div>

              <div style="
                font-weight:700;
                color:#0f172a;
                font-size:14px;
              ">
                ${app.course?.title || 'N/A'}
              </div>
            </div>

            <label
              for="batchSelect"
              style="
                display:block;
                font-size:13px;
                font-weight:700;
                color:#334155;
                margin-bottom:7px;
              "
            >
              Select Batch <span style="color:#ef4444;">*</span>
            </label>

            <select
              id="batchSelect"
              class="swal2-select"
              style="
                width:100%;
                margin:0;
                border-radius:12px;
                border:1px solid #cbd5e1;
                padding:12px 14px;
                font-size:13px;
                color:#0f172a;
                outline:none;
              "
            >
              <option value="">-- Select a batch --</option>
              ${optionsHtml}
            </select>

            <div id="batchInfo"
              style="
                display:none;
                margin-top:12px;
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:12px;
              "
            ></div>

            <div style="
              margin-top:13px;
              font-size:11px;
              color:#64748b;
              line-height:1.6;
            ">
              <strong>Note:</strong>
              The student will be enrolled in the selected batch
              after approval.
            </div>

          </div>
        `,

        width: 540,

        showCancelButton: true,

        confirmButtonText: 'Approve & Enroll',

        cancelButtonText: 'Cancel',

        confirmButtonColor: '#10B981',

        cancelButtonColor: '#64748B',

        focusConfirm: false,

        didOpen: () => {
          const select = document.getElementById('batchSelect');
          const info = document.getElementById('batchInfo');

          if (!select || !info) return;

          select.addEventListener('change', () => {
            const selectedId = select.value;

            if (!selectedId) {
              info.style.display = 'none';
              info.innerHTML = '';
              return;
            }

            const selectedBatch = batchOptions.find(
              (batch) => String(batch._id) === String(selectedId)
            );

            if (!selectedBatch) return;

            info.style.display = 'block';

            const teacherAvailable =
              selectedBatch.teacher ||
              selectedBatch.teacherName;

            info.innerHTML = `
              <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
              ">

                <div>
                  <div style="
                    font-size:10px;
                    color:#94a3b8;
                    margin-bottom:2px;
                  ">
                    BATCH
                  </div>

                  <div style="
                    font-size:13px;
                    font-weight:700;
                    color:#0f172a;
                  ">
                    ${
                      selectedBatch.name ||
                      selectedBatch.batchName ||
                      'Batch'
                    }
                  </div>
                </div>

                <div>
                  <div style="
                    font-size:10px;
                    color:#94a3b8;
                    margin-bottom:2px;
                  ">
                    STATUS
                  </div>

                  <div style="
                    font-size:13px;
                    font-weight:700;
                    color:#0F4C81;
                  ">
                    ${selectedBatch._statusLabel}
                  </div>
                </div>

                <div>
                  <div style="
                    font-size:10px;
                    color:#94a3b8;
                    margin-bottom:2px;
                  ">
                    TEACHER
                  </div>

                  <div style="
                    font-size:13px;
                    font-weight:600;
                    color:#334155;
                  ">
                    ${
                      teacherAvailable
                        ? selectedBatch._teacherName
                        : 'Not assigned'
                    }
                  </div>
                </div>

                <div>
                  <div style="
                    font-size:10px;
                    color:#94a3b8;
                    margin-bottom:2px;
                  ">
                    CAPACITY
                  </div>

                  <div style="
                    font-size:13px;
                    font-weight:600;
                    color:#334155;
                  ">
                    ${selectedBatch._currentStudents}
                    /
                    ${
                      selectedBatch._maximumStudents || '∞'
                    }
                    students
                  </div>
                </div>

              </div>
            `;
          });
        },

        preConfirm: () => {
          const selectedBatch =
            document.getElementById('batchSelect')?.value;

          if (!selectedBatch) {
            Swal.showValidationMessage(
              'Please select a batch before approving.'
            );

            return false;
          }

          const batch = batchOptions.find(
            (item) =>
              String(item._id) === String(selectedBatch)
          );

          if (!batch) {
            Swal.showValidationMessage(
              'Invalid batch selected.'
            );

            return false;
          }

          if (!batch.teacher && !batch.teacherName) {
            Swal.showValidationMessage(
              'This batch does not have a teacher assigned.'
            );

            return false;
          }

          return selectedBatch;
        },
      });

      // -----------------------------------------------------
      // CANCELLED
      // -----------------------------------------------------
      if (!result.isConfirmed || !result.value) {
        return;
      }

      const selectedBatchId = result.value;

      // -----------------------------------------------------
      // CONFIRM FINAL APPROVAL
      // -----------------------------------------------------
      const selectedBatch = batchOptions.find(
        (batch) =>
          String(batch._id) === String(selectedBatchId)
      );

      const confirmResult = await Swal.fire({
        title: 'Confirm Admission?',
        html: `
          <div style="text-align:left">

            <div style="
              background:#f8fafc;
              border:1px solid #e2e8f0;
              border-radius:12px;
              padding:14px;
            ">

              <div style="
                margin-bottom:10px;
              ">
                <span style="
                  color:#64748b;
                  font-size:12px;
                ">
                  Student
                </span>

                <div style="
                  font-weight:700;
                  color:#0f172a;
                ">
                  ${name}
                </div>
              </div>

              <div style="
                margin-bottom:10px;
              ">
                <span style="
                  color:#64748b;
                  font-size:12px;
                ">
                  Course
                </span>

                <div style="
                  font-weight:700;
                  color:#0f172a;
                ">
                  ${app.course?.title || 'N/A'}
                </div>
              </div>

              <div>
                <span style="
                  color:#64748b;
                  font-size:12px;
                ">
                  Selected Batch
                </span>

                <div style="
                  font-weight:700;
                  color:#0F4C81;
                ">
                  ${
                    selectedBatch?.name ||
                    selectedBatch?.batchName ||
                    'Selected Batch'
                  }
                </div>
              </div>

            </div>

            <p style="
              margin-top:14px;
              color:#64748b;
              font-size:13px;
            ">
              The student account will be created after approval.
            </p>

          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#64748B',
        confirmButtonText: 'Yes, Approve',
        cancelButtonText: 'Cancel',
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      // -----------------------------------------------------
      // APPROVE API CALL
      // -----------------------------------------------------
      setActionLoading(id);

      try {
        const res = await updateAdmission(id, {
          status: 'approved',
          batch: selectedBatchId,
        });

        Swal.fire({
          icon: 'success',
          title: 'Admission Approved!',
          html: `
            <div style="text-align:center">

              <div style="
                width:64px;
                height:64px;
                border-radius:50%;
                background:#dcfce7;
                color:#16a34a;
                display:flex;
                align-items:center;
                justify-content:center;
                margin:0 auto 15px;
                font-size:28px;
              ">
                ✓
              </div>

              <p style="
                color:#475569;
                margin-bottom:12px;
              ">
                Student account created successfully.
              </p>

              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:14px;
                text-align:left;
              ">

                <p style="margin:5px 0;">
                  <strong>Student ID:</strong>
                  ${
                    res?.data?.student?.studentId ||
                    'Generated'
                  }
                </p>

                <p style="margin:5px 0;">
                  <strong>Batch:</strong>
                  ${
                    selectedBatch?.name ||
                    selectedBatch?.batchName ||
                    'Selected Batch'
                  }
                </p>

                <p style="
                  margin:8px 0 0;
                  font-size:12px;
                  color:#64748b;
                ">
                  Default password is the student's phone number.
                </p>

              </div>

            </div>
          `,
          confirmButtonColor: '#0F4C81',
        });

        await fetchAdmissions();
      } catch (err) {
        console.error('Approve admission error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Approval Failed',
          text:
            err?.response?.data?.message ||
            'Could not approve application.',
          confirmButtonColor: '#0F4C81',
        });
      } finally {
        setActionLoading(null);
      }
    } catch (err) {
      console.error('Batch loading error:', err);

      setBatchLoading(null);

      Swal.fire({
        icon: 'error',
        title: 'Could Not Load Batches',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Could not load available batches for this course.',
        confirmButtonColor: '#0F4C81',
      });
    }
  };

  // =========================================================
  // REJECT
  // =========================================================
  const handleReject = async (id, name) => {
    const { value: remarks } = await Swal.fire({
      title: 'Reject Application?',

      input: 'textarea',

      inputLabel: `Reason for rejecting ${name}`,

      inputPlaceholder: 'Optional remarks...',

      inputAttributes: {
        'aria-label': 'Rejection reason',
      },

      showCancelButton: true,

      confirmButtonColor: '#EF4444',

      cancelButtonColor: '#6B7280',

      confirmButtonText: 'Reject',

      cancelButtonText: 'Cancel',
    });

    if (remarks === undefined) return;

    setActionLoading(id);

    try {
      await updateAdmission(id, {
        status: 'rejected',
        remarks:
          remarks || 'Application rejected',
      });

      Swal.fire({
        icon: 'success',
        title: 'Rejected',
        text: 'Application has been rejected.',
        confirmButtonColor: '#0F4C81',
      });

      await fetchAdmissions();
    } catch (err) {
      console.error('Reject admission error:', err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err?.response?.data?.message ||
          'Could not reject application.',
        confirmButtonColor: '#0F4C81',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Application?',

      text: 'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#EF4444',

      cancelButtonColor: '#6B7280',

      confirmButtonText: 'Delete',

      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdmission(id);

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Application deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchAdmissions();
    } catch (err) {
      console.error('Delete admission error:', err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err?.response?.data?.message ||
          'Could not delete application.',
        confirmButtonColor: '#0F4C81',
      });
    }
  };

  // =========================================================
  // VIEW APPLICATION
  // =========================================================
  const handleView = (app) => {
    const genderLabel = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    };

    Swal.fire({
      title: app.applicationId,

      html: `
        <div style="text-align:left;font-size:13px;">

          ${
            app.photo
              ? `
                <div style="
                  text-align:center;
                  margin-bottom:18px;
                ">
                  <img
                    src="${app.photo}"
                    alt="Student"
                    style="
                      width:90px;
                      height:90px;
                      object-fit:cover;
                      border-radius:50%;
                      border:4px solid #eff6ff;
                    "
                  />
                </div>
              `
              : ''
          }

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
          ">

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                STUDENT NAME
              </span>

              <div style="
                font-weight:700;
                margin-top:3px;
              ">
                ${app.studentName || 'N/A'}
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                PHONE
              </span>

              <div style="
                font-weight:700;
                margin-top:3px;
              ">
                ${app.phone || 'N/A'}
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                FATHER
              </span>

              <div style="margin-top:3px;">
                ${app.fatherName || 'N/A'}
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                MOTHER
              </span>

              <div style="margin-top:3px;">
                ${app.motherName || 'N/A'}
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                GENDER
              </span>

              <div style="margin-top:3px;">
                ${
                  genderLabel[app.gender] ||
                  app.gender ||
                  'N/A'
                }
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:10px;
              border-radius:10px;
            ">
              <span style="color:#64748b;font-size:10px;">
                EDUCATION
              </span>

              <div style="margin-top:3px;">
                ${app.education || 'N/A'}
              </div>
            </div>

          </div>

          <div style="
            background:#eff6ff;
            border:1px solid #dbeafe;
            padding:12px;
            border-radius:12px;
            margin-top:12px;
          ">

            <span style="
              color:#64748b;
              font-size:10px;
            ">
              COURSE
            </span>

            <div style="
              font-weight:700;
              color:#0F4C81;
              margin-top:3px;
            ">
              ${app.course?.title || 'N/A'}
            </div>

          </div>

          ${
            app.batch
              ? `
                <div style="
                  background:#f0fdf4;
                  border:1px solid #bbf7d0;
                  padding:12px;
                  border-radius:12px;
                  margin-top:10px;
                ">

                  <span style="
                    color:#64748b;
                    font-size:10px;
                  ">
                    BATCH
                  </span>

                  <div style="
                    font-weight:700;
                    color:#166534;
                    margin-top:3px;
                  ">
                    ${
                      app.batch?.name ||
                      app.batch?.batchName ||
                      'Assigned'
                    }
                  </div>

                </div>
              `
              : ''
          }

          <div style="
            background:#f8fafc;
            padding:12px;
            border-radius:12px;
            margin-top:10px;
          ">

            <p style="margin:5px 0;">
              <strong>Email:</strong>
              ${app.email || 'N/A'}
            </p>

            <p style="margin:5px 0;">
              <strong>Address:</strong>
              ${app.address || 'N/A'}
            </p>

            <p style="margin:5px 0;">
              <strong>Status:</strong>
              ${app.status || 'N/A'}
            </p>

            <p style="margin:5px 0;">
              <strong>Applied:</strong>
              ${
                app.appliedAt || app.createdAt
                  ? new Date(
                      app.appliedAt || app.createdAt
                    ).toLocaleDateString()
                  : 'N/A'
              }
            </p>

            ${
              app.remarks
                ? `
                  <p style="margin:8px 0 0;">
                    <strong>Remarks:</strong>
                    ${app.remarks}
                  </p>
                `
                : ''
            }

          </div>

        </div>
      `,

      confirmButtonColor: '#0F4C81',

      width: 550,

      customClass: {
        popup: 'rounded-2xl',
      },
    });
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div>
        <h1 className="text-2xl font-bold text-dark">
          Admissions
        </h1>

        <p className="text-gray-500 text-sm">
          Review and manage online admission applications
        </p>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Pending */}
        <div className="
          bg-white
          rounded-2xl
          p-4
          border border-gray-100
          shadow-sm
          text-center
          hover:shadow-md
          transition
        ">
          <p className="
            text-2xl
            font-bold
            text-amber-600
          ">
            {stats.pending}
          </p>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Pending
          </p>
        </div>

        {/* Approved */}
        <div className="
          bg-white
          rounded-2xl
          p-4
          border border-gray-100
          shadow-sm
          text-center
          hover:shadow-md
          transition
        ">
          <p className="
            text-2xl
            font-bold
            text-green-600
          ">
            {stats.approved}
          </p>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Approved
          </p>
        </div>

        {/* Rejected */}
        <div className="
          bg-white
          rounded-2xl
          p-4
          border border-gray-100
          shadow-sm
          text-center
          hover:shadow-md
          transition
        ">
          <p className="
            text-2xl
            font-bold
            text-red-600
          ">
            {stats.rejected}
          </p>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">
            Rejected
          </p>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="
        bg-white
        rounded-2xl
        p-4
        border border-gray-100
        shadow-sm
        flex
        flex-col
        sm:flex-row
        gap-3
      ">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1"
        >
          <FaSearch className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
            text-sm
          " />

          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              rounded-xl
              border border-gray-200
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-primary/30
              focus:border-primary
              transition
            "
          />
        </form>

        {/* Status Filter */}
        <div className="relative">
          <FaFilter className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
            text-sm
            pointer-events-none
          " />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              pl-10
              pr-8
              py-2.5
              rounded-xl
              border border-gray-200
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-primary/30
              appearance-none
              bg-white
              cursor-pointer
            "
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>

      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}
      <div className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        overflow-hidden
      ">

        {loading ? (

          <div className="
            flex
            items-center
            justify-center
            py-20
          ">
            <FaSpinner className="
              text-2xl
              text-primary
              animate-spin
            " />
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="
                  bg-gray-50
                  text-left
                  text-gray-500
                ">

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    whitespace-nowrap
                  ">
                    Application ID
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    whitespace-nowrap
                  ">
                    Name
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    hidden md:table-cell
                  ">
                    Phone
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    hidden lg:table-cell
                  ">
                    Course
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    hidden xl:table-cell
                  ">
                    Date
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                  ">
                    Status
                  </th>

                  <th className="
                    px-5
                    py-3.5
                    font-medium
                    text-right
                  ">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="
                divide-y
                divide-gray-50
              ">

                {admissions.map((app) => {

                  const isActionLoading =
                    actionLoading === app._id;

                  const isBatchLoading =
                    batchLoading === app._id;

                  return (
                    <tr
                      key={app._id}
                      className="
                        hover:bg-gray-50/70
                        transition
                      "
                    >

                      {/* Application ID */}
                      <td className="
                        px-5
                        py-3.5
                        font-mono
                        text-xs
                        text-primary
                        font-semibold
                        whitespace-nowrap
                      ">
                        {app.applicationId}
                      </td>

                      {/* Name */}
                      <td className="
                        px-5
                        py-3.5
                        font-medium
                        text-dark
                        whitespace-nowrap
                      ">
                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          {app.photo ? (
                            <img
                              src={app.photo}
                              alt=""
                              className="
                                w-8
                                h-8
                                rounded-full
                                object-cover
                                border
                                border-gray-200
                              "
                            />
                          ) : (
                            <div className="
                              w-8
                              h-8
                              rounded-full
                              bg-primary/10
                              text-primary
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                            ">
                              {app.studentName
                                ?.charAt(0)
                                ?.toUpperCase() || 'S'}
                            </div>
                          )}

                          <span>
                            {app.studentName}
                          </span>

                        </div>
                      </td>

                      {/* Phone */}
                      <td className="
                        px-5
                        py-3.5
                        text-gray-500
                        hidden md:table-cell
                        whitespace-nowrap
                      ">
                        {app.phone}
                      </td>

                      {/* Course */}
                      <td className="
                        px-5
                        py-3.5
                        text-gray-500
                        hidden lg:table-cell
                      ">
                        {app.course?.title || 'N/A'}
                      </td>

                      {/* Date */}
                      <td className="
                        px-5
                        py-3.5
                        text-gray-500
                        hidden xl:table-cell
                        whitespace-nowrap
                      ">
                        {new Date(
                          app.appliedAt ||
                          app.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="
                        px-5
                        py-3.5
                      ">
                        <span
                          className={`
                            text-xs
                            font-semibold
                            px-2.5
                            py-1
                            rounded-lg
                            capitalize
                            whitespace-nowrap
                            ${
                              statusColors[
                                app.status
                              ] ||
                              'bg-gray-100 text-gray-600'
                            }
                          `}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="
                        px-5
                        py-3.5
                      ">
                        <div className="
                          flex
                          items-center
                          justify-end
                          gap-1
                        ">

                          {/* View */}
                          <button
                            onClick={() =>
                              handleView(app)
                            }
                            className="
                              p-2
                              rounded-lg
                              text-gray-400
                              hover:text-primary
                              hover:bg-primary/10
                              transition
                            "
                            title="View Application"
                          >
                            <FaEye className="text-sm" />
                          </button>

                          {/* Pending Actions */}
                          {app.status === 'pending' && (
                            <>
                              {/* Approve */}
                              <button
                                onClick={() =>
                                  handleApprove(app)
                                }
                                disabled={
                                  isActionLoading ||
                                  isBatchLoading
                                }
                                className="
                                  p-2
                                  rounded-lg
                                  text-gray-400
                                  hover:text-success
                                  hover:bg-success/10
                                  transition
                                  disabled:opacity-50
                                  disabled:cursor-not-allowed
                                "
                                title="Approve & Select Batch"
                              >
                                {isBatchLoading ||
                                isActionLoading ? (
                                  <FaSpinner className="
                                    text-sm
                                    animate-spin
                                  " />
                                ) : (
                                  <FaCheck className="text-sm" />
                                )}
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() =>
                                  handleReject(
                                    app._id,
                                    app.studentName
                                  )
                                }
                                disabled={
                                  isActionLoading ||
                                  isBatchLoading
                                }
                                className="
                                  p-2
                                  rounded-lg
                                  text-gray-400
                                  hover:text-danger
                                  hover:bg-danger/10
                                  transition
                                  disabled:opacity-50
                                  disabled:cursor-not-allowed
                                "
                                title="Reject"
                              >
                                <FaTimes className="text-sm" />
                              </button>
                            </>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(app._id)
                            }
                            disabled={
                              isActionLoading ||
                              isBatchLoading
                            }
                            className="
                              p-2
                              rounded-lg
                              text-gray-400
                              hover:text-danger
                              hover:bg-danger/10
                              transition
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

        {/* Empty */}
        {!loading &&
          admissions.length === 0 && (
            <div className="
              text-center
              py-14
              text-gray-400
            ">
              <div className="
                w-14
                h-14
                mx-auto
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                mb-3
              ">
                <FaUsers className="text-gray-400" />
              </div>

              <p className="font-medium">
                No applications found
              </p>

              <p className="text-xs mt-1">
                Applications submitted from the
                public form will appear here.
              </p>
            </div>
          )}

      </div>

    </div>
  );
};

export default Admissions;