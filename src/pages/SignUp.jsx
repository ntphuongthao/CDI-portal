import { useState } from "react";
import { supabase } from "../context/supabaseClient";
import "./SignUp.css";
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    password: "",
    email: "",

  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.password || !user.email) {
      alert("You must fill in all information!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
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
    <div className="container" style={{minHeight: '730px'}}>
      <div className="container registration-form">
        {loading ? "Loading..." : (
          <>
            <img className="school-logo" src="./school-logo.png" alt="School Logo" width="250px" />
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>

              <div className="flex">
                <AiOutlineMail size={30} />
                <input placeholder="Email" type="text" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div className="flex">
                <RiLockPasswordLine size={30} />
                <input placeholder="Password" type="password" name="password" value={user.password} onChange={handleChange} />
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