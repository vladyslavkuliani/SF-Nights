import React, { Component } from 'react';
import axios from 'axios';
import Footer from './Footer';

class LogInForm extends Component {
  onLogIn(event){
    event.preventDefault();

    axios.defaults.baseURL = 'https://hidden-sierra-78177.herokuapp.com';
    var userData = {
      email: document.getElementById("login__username").value,
      password: document.getElementById("login__password").value
    };

    console.log(userData);
    axios.post("/login", userData).then(function(response){
      window.location.replace("/profile");
    });
  }

  render(){
    return (
      <div className="login">
            {/*<p className="sf-nights-name">SF Nights</p>*/}
            <form className="form login form-login">

              <div className="form__field">
                <label for="login__username"><span className="hidden">Username</span></label>

                <input className="form__input form-control" id="login__username"  type="text" name="email" placeholder="Email"/>
              </div>

              <div className="form__field">
                <label for="login__password"><span className="hidden">Password</span></label>
                <input className="form__input form-control" id="login__password" type="password" name="password" placeholder="Password"/>
              </div>

              <div className="form__field">
                <input className="btn btn-primary btn-login-signup" type="submit" value="Log In" onClick={this.onLogIn}/>
              </div>

            </form>

            <p className="text--center signup-prompt"><span className="login-text">Not a member?</span> <a href="/signup" id="sign-up-link" onClick={this.props.onClick}>Sign up now</a></p>
            <Footer/>
      </div>
    );
  }
}

export default LogInForm;
