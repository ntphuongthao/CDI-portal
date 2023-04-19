import { useState } from "react";
import { supabase } from "../supabaseClient";
import CountryDropdown from "./CountryDropdown";
import "./SignUp.css";
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlinePlace } from 'react-icons/md';

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
    <div className="container">
      <div className="container registration-form">
        {loading ? "Loading..." : (
          <>
            <img className="school-logo" src="./school-logo.png" alt="School Logo" width="250px" />
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>

              <div className="flex">
                <AiOutlineUser size={30} />
                <input placeholder="Username" type="text" name="username" value={user.username} onChange={handleChange} />
              </div>
              <div className="flex">
                <AiOutlineMail size={30} />
                <input placeholder="Email" type="text" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div className="flex">
                <RiLockPasswordLine size={30} />
                <input placeholder="Password" type="password" name="password" value={user.password} onChange={handleChange} />
              </div>
              <div className="flex">
                <MdOutlinePlace size={30} />
                <CountryDropdown country={user.country} handleChange={handleChange}/>
              </div>
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
    </div>
  );
}

export default SignUp;