import { useState } from "react";
import { supabase } from "../context/supabaseClient";
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function signInWithEmail(event) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      window.location = "/";
    }
  }

  return (
    <div className="container">
      <div className="container signUpForm addMarginTop">
        <img className="school-logo" src="./school-logo.png" alt="School Logo" width="250px" />
        <h2>Log in with your account</h2>
        <form onSubmit={signInWithEmail}>
          {error && 
            (<div className="errorBanner">
              {error}
            </div>)
          }

          <div className="flex">
            {/* <label htmlFor="email">Email</label> */}
            <AiOutlineMail size={30} />
            <input type="text" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          

          <div className="flex">
            {/* <label htmlFor="password">Password</label> */}
            <RiLockPasswordLine size={30} />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          

          <div className="flex">
            <button className="signUpBtn" type="submit">Log In</button>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default SignIn;