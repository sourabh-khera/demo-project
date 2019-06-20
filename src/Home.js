import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Home extends Component {


  render() {
    return (
     
        <div id="ember365" class="ember-view ember-app"><div class="menu">
        <ul>
          <li class="home"><a href="index.html">h</a></li>
          <li class="back"><a>M</a></li>
          <li class="titlebar">Arodek</li>
          <li class="logout"><a>o<span class="text">Logout</span></a></li>
          <li class="profile"><a href="profile.html">u<span class="text">Profile</span></a></li>
          <li class="docs"><a href="docs.html">d<span class="text">Docs</span></a></li>
          <li class="help"><a href="icon-key.html">?<span class="text">Help</span></a></li>
          
            <li class="admin"><a href="admin/organisation.html">c<span class="text">Admin</span></a></li>
          
        </ul>
      </div>
      <div id="application">
        
        
        
        <ul class="collections">
        
          
          <li class="messageButtonCell">
            <a class="ember-view danger intruder" href="emergency.html"><div class="buttonText">Emergency</div></a>
            <a class="ember-view danger" href="active-shooter.html"><div class="buttonText">Active Shooter</div></a>
          </li>
          <li class="messageButtonCell">
            <a class="ember-view" href="send-message.html"><div class="buttonText">Send Message</div></a>
            <a class="ember-view" href="view-message.html"><div class="buttonText">View Messages</div></a>
          </li>
          
        
        
          <li><a class="ember-view" href="collection.html">Emergency Response Plan</a></li>
        
          <li><a class="ember-view" href="#">Transportation Emergency Procedure Guide</a></li>
        
          <li><a class="ember-view" href="#">Building Personnel Procedure Guide</a></li>
        
          <li><a class="ember-view" href="#">Safe Schools</a></li>
        
          <li><a class="ember-view" href="#">Abcd</a></li>
        
        </ul>
      
      <div id="welcome">
        <div class="header">
          <div class="content">
          
            <div class="orgLogo-container">
              <img class="orgLogo" src="./assets/images/Arodek_logo_new.JPG"/>
            </div>
          
          </div>
        </div>
        <div class="about">
          <h2>Mobile Emergency Response Plan (M.E.R.P.)</h2>
          <p>The MERP is designed to make your emergency plans and related information portable, immediately accessible, and easily revisable. It is available as both an online and mobile application. It provides your personnel with the tasks to be performed in the critical first moments of an incident. You can also add information to assist in your planning and recovery efforts.</p>
          <p>The MERP comes pre-loaded with content that is based upon best practices identified by emergency services agencies. This information is displayed in a simple task-based format. Simply add text and documents to customize the MERP to further meet the needs of your Organization.</p>
        </div>
        <div class="copyright">
          Copyright © 2018 Safeguard Risk Solutions LLC<br/><strong>Patent Pending</strong>
        </div>
      </div>
      
      </div>
      
      </div>

   
    );
  }
}

export default Home;
