import { useState } from "react";
import { supabase } from "../context/supabaseClient";
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
    <div className="container addMarginTop">
      <h2>Log into your account</h2>
      <form onSubmit={signInWithEmail}>
        {error && 
          (<div className="errorBanner">
            {error}
          </div>)
        }
        <label htmlFor="email">Email</label>
        <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><br/>

        <div className="flex">
          <button className="signUpBtn" type="submit">Log In</button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;