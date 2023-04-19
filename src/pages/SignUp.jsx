import { useState } from "react";
import { supabase } from "../supabaseClient";
import CountryDropdown from "./CountryDropdown";
import "./SignUp.css";

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    gender: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.username || !user.email || !user.password || !user.country || !user.gender) {
      alert("You must fill in all information!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        username: user.username,
        gender: user.gender,
        country: user.country,
      });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({...user, [name]: value});
  }

  return (
    <div className="container addMarginTop">
      {loading ? "Loading..." : (
        <>
          <img className="school-logo" src="./school-logo.png" alt="School Logo" width="250px" />
          <h3>You can register your account here!</h3>
          <form onSubmit={handleSubmit}>

            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={user.username} onChange={handleChange} />

            <label htmlFor="email">Email</label>
            <input type="text" name="email" value={user.email} onChange={handleChange} />

            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={user.password} onChange={handleChange} /><br/>

            <CountryDropdown country={user.country} handleChange={handleChange}/>

            <div className="flex">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={user.gender === 'male'}
                  onChange={handleChange}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={user.gender === 'female'}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>

            <div className="flex">
              <button className="signUpBtn" type="submit">Register</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default SignUp;