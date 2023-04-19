import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({email: email, password: password});
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container addMarginTop">
      {loading ? "Loading..." : (
        <>
          <img className="school-logo" src="./school-logo.png" alt="School Logo" width="250px" />
          <h3>You can register your account here!</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><br/>

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