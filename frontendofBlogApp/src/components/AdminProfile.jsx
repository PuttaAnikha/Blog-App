import { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import api from "../api/axios";
import {
  pageWrapper,
  headingClass,
  mutedText,
  divider,
  errorClass,
  loadingClass,
  emptyStateClass,
  successClass,
} from "../styles/common";
import { useNavigate } from "react-router";

function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingEmail, setDeletingEmail] = useState(null);

  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  // Fetch all users and authors
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin-api/users");
      setUsers(res.data.payload || []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.data?.message || "Failed to load users and authors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user/author active status
  const toggleUserStatus = async (email, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await api.patch("/admin-api/user-status", {
        email,
        isUserActive: newStatus,
      });
      // Update local state optimistically
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, isUserActive: newStatus } : u))
      );
      setSuccess(
        `${email} has been ${newStatus ? "activated" : "deactivated"} successfully.`
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("Toggle status error:", err);
      setError(err.response?.data?.message || "Failed to update status. Please try again.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Permanently delete a user/author
  const deleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${email}? This cannot be undone.`)) {
      return;
    }
    setDeletingEmail(email);
    try {
      await api.delete("/admin-api/user-delete", { data: { email } });
      // Remove from local state
      setUsers((prev) => prev.filter((u) => u.email !== email));
      setSuccess(`${email} has been permanently deleted.`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.response?.data?.message || "Failed to delete user. Please try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setDeletingEmail(null);
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className={headingClass}>Admin Dashboard</h1>
          <p className={mutedText}>Manage users and authors of the platform</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className={divider}></div>

      {/* FEEDBACK */}
      {error && <div className={`${errorClass} mb-6`}>{error}</div>}
      {success && <div className={`${successClass} mb-6`}>{success}</div>}

      {/* USER LIST */}
      {loading ? (
        <p className={loadingClass}>Loading dashboard data...</p>
      ) : users.length === 0 ? (
        <div className={emptyStateClass}>No users or authors found.</div>
      ) : (
        <>
          <p className="text-sm text-[#6e6e73] mb-4">
            Showing <span className="font-semibold text-[#1d1d1f]">{users.length}</span> accounts
          </p>
          <div className="bg-[#f5f5f7] rounded-3xl overflow-hidden border border-[#e8e8ed]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#ebebf0] border-b border-[#e8e8ed]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6e6e73] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8ed]">
                {users.map((user) => (
                  <tr key={user._id || user.email} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-[#e8e8ed]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold">
                            {user.firstName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#1d1d1f]">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-[#6e6e73]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border ${
                          user.role === "AUTHOR"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "bg-white border-[#e8e8ed] text-[#6e6e73]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.isUserActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            user.isUserActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.isUserActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Activate / Deactivate */}
                        <button
                          onClick={() => toggleUserStatus(user.email, user.isUserActive)}
                          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition ${
                            user.isUserActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {user.isUserActive ? "Deactivate" : "Activate"}
                        </button>
                        {/* Permanent Delete */}
                        <button
                          onClick={() => deleteUser(user.email)}
                          disabled={deletingEmail === user.email}
                          className="text-xs font-semibold px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                        >
                          {deletingEmail === user.email ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProfile;