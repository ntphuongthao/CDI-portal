import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";

const DePauw = () => {
  return (
    <div className="container">
      <h1>Welcome to DePauwHub!</h1>
      <p>This is we you can freely share your thoughts and opinions!</p>
      <br />
      <p>If you don't have an account yet? <Link to='/sign-up'>Sign Up</Link></p>
      <p>Otherwise, you can just <Link to='/sign-in'>Sign In</Link></p>
      <br />
    </div>
  );
}

export default DePauw;