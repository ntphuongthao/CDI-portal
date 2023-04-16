import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";

const DePauw = () => {
  return (
    <div className="container">
      <h1>Welcome to Center of Diversity and Inclusion Portal!</h1>
      <p>Feel free to share your 
        ideas and viewpoints here! We appreciate any input as it helps to enhance the diversity of DePauw.</p>
      <img src="./cdi.jpeg" alt="Center of diversity and inclusion" style={{margin: "2rem"}} />
      <br />
      <p>If you don't have an account yet? <Link to='/sign-up'>Sign Up</Link></p>
      <p>Otherwise, you can just <Link to='/sign-in'>Sign In</Link></p>
      <br />
    </div>
  );
}

export default DePauw;