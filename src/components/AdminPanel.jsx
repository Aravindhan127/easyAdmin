import { useEffect, useState } from "react";
import "./AdminPanel.css";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    balance: "",
    active: "inactive",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupAction, setPopupAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let response = await fetch(
        "https://moneyversebackends.onrender.com/api/v1/users"
      ); // Replace with actual API
      let data = await response.json();
      setUsers(
        data.map((user) => ({ ...user, active: "inactive", balance: "N/A" }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openPopup = (message, action, user) => {
    setPopupMessage(message);
    setPopupAction(() => action);
    setSelectedUser(user);
    setShowPopup(true);
  };

  const confirmAction = () => {
    if (popupAction) popupAction(selectedUser);
    setShowPopup(false);
  };

  const editUser = (user) => {
    setEditingUser(user.id);
    setEditedUser({
      username: user.username,
      email: user.email,
      balance: user.balance,
      active: user.active,
    });
  };

  const saveEdit = (user) => {
    openPopup(
      "Are you sure you want to edit this user?",
      async () => {
        await fetch(
          `https://moneyversebackends.onrender.com/api/v1/users/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: editedUser.username,
              email: editedUser.email,
              balance: Number(editedUser.wallet),
            }),
          }
        );
        fetchUsers();
        setEditingUser(null);
      },
      user
    );
  };

  const deleteUser = (id) => {
    openPopup(
      "Are you sure you want to Active or Inactive this user?",
      async () => {
        await fetch(
          `https://moneyversebackend-production.up.railway.app/api/v1/users/${id}`
        );
        fetchUsers();
      },
      id
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(
              (user) =>
                user.username.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editedUser.wallet}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, wallet: e.target.value })
                      }
                    />
                  ) : (
                    user.wallet
                  )}
                </td>
                {console.log(typeof user.isActive)}
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  {editingUser === user.id ? (
                    <button onClick={() => saveEdit(user)}>Save</button>
                  ) : (
                    <button onClick={() => editUser(user)}>Edit</button>
                  )}
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={confirmAction}>Confirm</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
