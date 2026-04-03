import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../Services/userService";
import type { UserModel } from "../../Models/UserModel";

export const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false); // 🔹 trigger reload

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const resp = await UserService.GetList({
        search,
        pageNumber: 1,
        pageSize: 100,
      });
      setUsers(resp.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and whenever refreshFlag changes
  useEffect(() => {
    loadUsers();
  }, [refreshFlag]); // 🔹 added dependency

  // Delete user
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await UserService.Delete(id);
      alert("User deleted successfully!");
      setRefreshFlag(!refreshFlag); // 🔹 trigger reload
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <h3>Users</h3>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={() => setRefreshFlag(!refreshFlag)} // 🔹 trigger reload on search
      />

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.fullname}</td>
                <td>{user.role}</td>
                <td>{user.status === "1" ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};