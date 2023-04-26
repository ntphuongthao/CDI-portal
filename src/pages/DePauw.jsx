import { Link } from "react-router-dom";
import Typewriter from 'typewriter-effect';
import './DePauw.css';

const DePauw = () => {
  return (
    <div className="landing-page">
      <div className="landing-wrapper">
        <div className="h1 vertical-text graphite">DIVERSITY</div>
        <div className="flex depauw-title-banner">
          <h1>Howdy Tigers!</h1>
          <img src="./depauw-remove-background.png" alt="depauw tiger" height='50px'/>
        </div>
        <div className="flex">
          <div className="flex" style={{width: '90%'}}>
            <div className="container">
              <Typewriter
                options={{
                  strings: ['Are you an international student?', "Don't know how to find resources?", 'Welcome here!'],
                  autoStart: true,
                  loop: true,
                }}
              />
              <p style={{textAlign: 'center'}}>Feel free to share your 
                ideas and viewpoints here! We appreciate any input as it helps to enhance the diversity of DePauw.</p>
              <br />
              <div className="container depauw-links">
                <b>If you don't have an account yet? <Link to='/sign-up'>Sign Up</Link></b>
                <b>Otherwise, you can just <Link to='/sign-in'>Sign In</Link></b>
              </div>
            </div>
            {/* <img src="./cdi.jpeg" alt="Center of diversity and inclusion" style={{margin: "2rem"}} /> */}
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
}

export default DePauw;