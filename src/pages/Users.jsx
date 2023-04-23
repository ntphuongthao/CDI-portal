import { useEffect, useState } from "react";
import { supabase } from "../context/supabaseClient";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      let { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, gender, country');
  
      if (error) {
        alert(error.message);
        return;
      }
      setUsers(users);
      console.log(2002, users);
    };

    getAllUsers();
  }, []);
  return (
    <div className="container addMarginTop">
      <h1>View all profiles</h1>
      {users.length > 0 && users.map((user) => (
        <div key={user.id} className="flex user-card">
          {console.log(444, user)}
          <img src={`${user.country ? `./flags/Flag_of_${user.country.replace(" ", "")}.svg.png` : "./no-image.jpeg"}`} alt="flag" width="150px" height="120px" />
          <div>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Country:</b> {user.country}</p>
            <p><b>Gender:</b> {user.gender}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Users;