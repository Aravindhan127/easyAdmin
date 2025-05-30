import { useEffect, useState } from "react";
import "./AdminPanel.css";

function Withdraw() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  // const [tocken, setTocken] = useState("");
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let response = await fetch(
        "https://moneyversebackends.onrender.com/api/v1/transactions",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); // Replace with actual API
      let data = await response.json();
      setUsers(
        data.map((user) => ({
          id: user.id,
          username: user.user.username,
          email: user.user.email,
          amount: user.amount, // Change as per actual data
          upiId: user.upiId, // Change as per actual data
          status: user.status,
        }))
      );
      console.log("i:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateStatus = async (userId, newStatus) => {
    try {
      await fetch(
        `https://moneyversebackends.onrender.com/api/v1/transactions/${userId}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <input type="text" placeholder="Tocken" value={tocken} onChange={(e) => setTocken(e.target.value)}/>  */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Amount</th>
            <th>UPI ID</th>
            <th>Status</th>
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
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.amount}</td>
                <td>{user.upiId}</td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) => updateStatus(user.id, e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Withdraw;
