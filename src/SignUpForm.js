import React, { Component } from 'react';
import axios from 'axios';

class SignUpForm extends Component {

  onSignUp(event){
    event.preventDefault();
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + (process.env.API_PORT || 3001);
    var userData = {
      name: document.getElementById("signup__username").value,
      email: document.getElementById("signup__email").value,
      dob: document.getElementById("signup__dob").value,
      password: document.getElementById("signup__password").value
    };

    console.log(userData);

    axios.post('/signup', userData).then(function(response){
      console.log("this was just created -> ", response);
    });
  }

  render(){
    return (
      <div>
        <form id="signUpForm" className="form login form-signup">

          <div className="form__field">
            <label for="signup__username"><span className="hidden">Full name</span></label>

            <input className="form__input" id="signup__username"  type="text" name="name" placeholder="Full Name"/>
          </div>

          <div className="form__field">
            <label for="signup__email"><span className="hidden">Email</span></label>
            <input className="form__input" id="signup__email" type="text" name="email" placeholder="email@example.com"/>
          </div>

          <div className="form__field">
            <label for="signup__dob"><span className="hidden">dob</span></label>
            <input className="form__input" id="signup__dob" type="date" name="dob" placeholder="Date of birth"/>
          </div>

          <div className="form__field">
            <label for="signup__password"><span className="hidden">Password</span></label>
            <input className="form__input" id="signup__password" type="password" name="passwordDigest" placeholder="Password"/>
          </div>

          <div className="form__field">
            <label for="signup__password_confirm"><span className="hidden">Password</span></label>
            <input className="form__input" id="signup__password_confirm" type="password" name="passwordConfirmation" placeholder="Confirm Password"/>
          </div>

          <div className="form__field">
            <input type="submit" value="Sign Up" onClick={this.onSignUp}/>
          </div>

        </form>
        <p className="text--center">Go to <a href="/login" id="logIn-link" onClick={this.props.onClick}>LogIn page</a></p>
      </div>
    );
  }
}

export default SignUpForm;
