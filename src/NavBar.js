import React, { Component } from 'react';

class NavBar extends Component {
  home(){
    window.location.replace("/profile");
  }

  clubsAroundMe(){
    window.location.replace("/places");
  }

  logOut(){
    window.location.replace('/logout');
  }

  render(){
    return (
      <div className="header">
        <div className="menu-option" onClick={this.home.bind(this)}>Home</div>
        {this.props.gotLocationData && <div className="menu-option" onClick={this.clubsAroundMe.bind(this)}>Clubs around me</div>}
        <div className="menu-option-logout" onClick={this.logOut.bind(this)}>Log Out</div>
      </div>
    );
  }
}

export default NavBar;
