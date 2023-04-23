import { useEffect, useState } from "react";
import { supabase } from "../context/supabaseClient";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const mockData = [
    {
      country: "Vietnam",
      profiles: 200,
      male: 100,
      female: 98,
    },
    {
      country: "China",
      profiles: 250,
      male: 150,
      female: 90,
    },
    {
      country: "Bangladesh",
      profiles: 10,
      male: 4,
      female: 5,
    },
    {
      country: "Japan",
      profiles: 30,
      male: 20,
      female: 10,
    },
    {
      country: "Korea",
      profiles: 20,
      male: 10,
      female: 10,
    },
  ];

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
    };

    getAllUsers();
  }, []);

  return (
    <div className="container addMarginTop">
      <h1>View all profiles</h1>
      <br />
      <br />
      <div className="container">
        <h2>Student Body Demographic Graph in DePauw University</h2>
        <BarChart width={750} height={400} data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profiles" fill="#8884d8" />
          <Bar dataKey="male" fill="#82ca9d" />
          <Bar dataKey="female" fill="#e1ad01" />
        </BarChart>
        <p>(This statistics are just for demonstration purposes since we don't have enough data to generate the final graph.)</p>
      </div>
      <br /><br />
      {users.length > 0 && users.map((user) => (
        <div key={user.id} className="flex user-card">
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