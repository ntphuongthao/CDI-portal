import { useState } from "react";
import { supabase } from "../context/supabaseClient";
import "./SignUp.css";
import { AiOutlineMail, AiOutlineCheck, AiOutlineWarning } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [secondPasswordCheck, setSecondPasswordCheck] = useState(false);
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [user, setUser] = useState({
    password: "",
    email: "",

  });

  const passwordClass = () => {
    if (passwordStrength === 0) return;
    else if (passwordStrength === 1) return "danger";
    else if (passwordStrength === 2) return "easy-warning";
    else if (passwordStrength === 3) return "hard-warning";
    else if (passwordStrength === 4) return "success";
  }

  const filterPassword = (password) => {
    // Define regular expressions to match certain patterns
    const uppercaseRegex = /[A-Z]/g;
    const lowercaseRegex = /[a-z]/g;
    const numberRegex = /[0-9]/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  
    // Apply each regular expression to the password
    const hasUppercase = password.match(uppercaseRegex);
    const hasLowercase = password.match(lowercaseRegex);
    const hasNumber = password.match(numberRegex);
    const hasSpecialChar = password.match(specialCharRegex);
  
    // Determine the password strength based on the pattern matches
    let strength = 0;
    if (hasUppercase) {
      setHasUpper(true);
      strength += 1;
    } else {
      setHasUpper(false);
    }

    if (hasLowercase) {
      setHasLower(true);
      strength += 1;
    } else {
      setHasLower(false);
    }

    if (hasNumber) {
      setHasNumber(true);
      strength += 1;
    } else {
      setHasNumber(false);
    }

    if (hasSpecialChar) {
      setHasSpecialChar(true);
      strength += 1;
    } else {
      setHasSpecialChar(false);
    }
  
    return strength;
  }

  // function filterEmail(email) {
  //   const isDepauwEmail = email.indexOf('@depauw.edu') !== -1;
  //   return isDepauwEmail;
  // }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.password && !user.email) {
      setErrors("Please enter registration password and email address!");
      return;
    }

    if (!user.password) {
      setErrors("Please enter your password!")
      return;
    }

    if (!user.email) {
      setErrors("Please enter your email address!")
      return;
    }

    // if (!filterEmail(user.email)) {
    //   setErrors("You must use DePauw email to register!");
    //   return;
    // }

    if (passwordStrength < 3) {
      setErrors("Please use a stronger password!");
      return;
    }

    if (!secondPasswordCheck) {
      setErrors("Please re-enter the same password!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });
      if (error) throw error;
      alert('Success!!! Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "password") {
      const strength = filterPassword(value);
      setPasswordStrength(strength);
    }
    setUser({...user, [name]: value});
  }

  const handleReEnteredPassword = (e) => {
    setReenteredPassword(e.target.value);
    if (e.target.value === user.password) setSecondPasswordCheck(true);
    else setSecondPasswordCheck(false);
  }

  return (
    <div className="container" style={{minHeight: '730px'}}>
      <div className="container registration-form">
        {loading ? "Loading..." : (
          <>
            <img className="school-logo" src="./school-logo.png" alt="School Logo" width="200px" />
            <h2>Registration Form</h2>
            {errors && (
              <>
                <br />
                <p className="flex warning-banner">
                  <AiOutlineWarning size={25}/> {errors}
                </p>
              </>
            )}
            <br />
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
                <RiLockPasswordLine size={30} />
                <input placeholder="Re-Enter Your Password" type="password" value={reenteredPassword} onChange={handleReEnteredPassword} />
              </div>
              <div className="progress">
                <div className={`progress-bar-${passwordClass()}`}>
                </div>
              </div>
              <br />
              <div className="container">
                <ul className="container" style={{fontSize: '12px'}}>
                  <div className="flex">
                    {hasLower ? <AiOutlineCheck style={{color: 'green'}}/> : <AiOutlineWarning style={{color: 'red'}}/>} 
                    <li>Lowercase characters</li>
                  </div>
                  <div className="flex">
                    {hasUpper ? <AiOutlineCheck style={{color: 'green'}}/> : <AiOutlineWarning style={{color: 'red'}}/>} 
                    <li>Uppercase characters</li>
                  </div>
                  <div className="flex">
                    {hasNumber ? <AiOutlineCheck style={{color: 'green'}}/> : <AiOutlineWarning style={{color: 'red'}}/>} 
                    <li>Has numbers in password</li>
                  </div>
                  <div className="flex">
                    {hasSpecialChar ? <AiOutlineCheck style={{color: 'green'}}/> : <AiOutlineWarning style={{color: 'red'}}/>} 
                    <li>Has special characters in password</li>
                  </div>
                  <div className="flex">
                    {secondPasswordCheck ? <AiOutlineCheck style={{color: 'green'}}/> : <AiOutlineWarning style={{color: 'red'}}/>} 
                    <li>Re-entered password is matching</li>
                  </div>
                </ul>
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