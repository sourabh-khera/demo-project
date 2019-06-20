import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Organization from './admin/Organization'
import Home from './Home';
import Login from './Login';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Help extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.Gotoorg=this.Gotoorg.bind(this);

        this.Gotoorg=this.Gotoorg.bind(this);
        this.GotoHelp=this.GotoHelp.bind(this);
        this.GotoDoc=this.GotoDoc.bind(this);
        this.GotoProfile=this.GotoProfile.bind(this);
        this.GotoHome=this.GotoHome.bind(this);
     }

     GotoHome(){
      this.props.history.push('/Collection');
  
    }

  Gotoorg(){
    this.props.history.push('/Organization');
    //alert("click");
    }
  GotoHelp(){
    this.props.history.push('/help');
  }
  
  GotoDoc(){
    this.props.history.push('/Doc');
  }
  
  GotoProfile(){
    this.props.history.push('/Profile');
  
  }
  
    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }


  render() {
    return (
      
        <div class="no-touch ember-application chartview">
    <div id="ember361" class="ember-view ember-app"><div class="menu">
        <ul>
          <li onClick= {this.GotoHome} class="homeicon" ><a>h</a></li>
          <li class="back"><a>M</a></li>
          <li class="titlebar">Arodek</li>
          <li class="logout" onClick= {this.logout}><a onClick= {this.logout}>o<span class="text">Logout</span></a></li>
          <li class="profile" onClick={this.GotoProfile}><a>u<span class="text">Profile</span></a></li>
          <li class="docs" onClick={this.GotoDoc}><a>d<span class="text">Docs</span></a></li>
          <li class="help"><a>?<span class="text">Help</span></a></li>
          <li class="admin" onClick={this.Gotoorg}><a  >c<span class="text">Admin</span></a></li>
        </ul>
      </div>
      <div id="application">
        <div class="overlay-container">
        <a href="#" class="close" data-ember-action="2294">x</a>
        <div class="key">
          <h2>Icon Key</h2>
          <ul>
            <li>
              <span class="symbol">h</span>
              <span class="description"><strong>Home Button</strong> - Displays the available Emergency Plans based on Group Assignment.</span>
            </li>
            <li>
              <span class="symbol">c</span>
              <span class="description"><strong>Adminstrative Settings</strong>  - Provides access to Administrative options.</span>
            </li>
            <li>
              <span class="symbol">o</span>
              <span class="description"><strong>Sign Out</strong>  - Signs the user out of the MERP system.</span>
            </li>
            <li>
              <span class="symbol">a</span>
              <span class="description"> <strong>Incident Icon</strong> - Indicates which event is currently selected.
              </span>
            </li>
            <li>
              <span class="symbol">d</span>
              <span class="description"> <strong>Supporting Files</strong> - Access to any supporting files that have been uploaded.
              </span>
            </li>
            <li>
              <span class="symbol">p</span>
              <span class="description"><strong>Overview</strong> - Displays a flow chart overview of the incident selected.</span>
            </li>
            <li>
              <span class="symbol"><div class="event_aid_icon"></div></span>
              <span class="description"><strong>Event Aid</strong> - Offers more information specific to the incident selected.</span>
            </li>
            <li>
              <span class="symbol"><div class="incident_log_icon"></div></span>
              <span class="description"><strong>Incident Log</strong> - Displays the incident log with the ability to add in additional notes.</span>
            </li>
            <li>
              <span class="symbol">x</span>
              <span class="description"><strong>Close</strong> - Closes the current window and returns the user to the previous screen.</span>
            </li>
          </ul>
        </div>
      </div>
      
        
        
        
      
      </div>

      
      </div>

   

  </div>
    );
  }
}

export default Help;
