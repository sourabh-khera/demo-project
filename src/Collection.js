import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Organization from './admin/Organization'
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Collection extends Component {
    constructor(props){
        super(props);
        this.state = {
		   ObjCollection: [],
		   ObjOrganization:'',
		   isLoggedIn: false,
		   render: false
        }
    this.Gotoorg=this.Gotoorg.bind(this);
	this.GotoHelp=this.GotoHelp.bind(this);
    this.GotoDoc=this.GotoDoc.bind(this);
    this.GotoProfile=this.GotoProfile.bind(this);
	this.GotoSendMessage=this.GotoSendMessage.bind(this);
	this.GotoEmergency=this.GotoEmergency.bind(this);
	this.GotoShooter=this.GotoShooter.bind(this);
	this.GotoViewMessage=this.GotoViewMessage.bind(this);
	this.redirectChart=this.redirectChart.bind(this);
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
	
	redirectChart(collectionid){
		this.props.history.push('/Charts?collectionid='+collectionid);
    }

  GotoProfile(){
    this.props.history.push('/Profile');
  }
 
 GotoSendMessage()
  {
	  this.props.history.push('compose');
  }
  
  GotoEmergency()
  {
	  this.props.history.push('emergency');
  }
  
  GotoShooter()
  {
	  this.props.history.push('shooter');
  }
  
  GotoViewMessage()
  {
	this.props.history.push('messages');
	 
  }

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
  
  componentDidMount(){
  this.getCollectionList();
  this.getOrganizationList();
  }
  getOrganizationList()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }
  getCollectionList()
  {
	  let safeguard= localStorage.getItem("safeguard");
      let safeguard_array=JSON.parse(safeguard);
	  this.setState({
          ObjCollection: safeguard_array.collections
      })
  }
  render() {
	let token = localStorage.getItem("session");
	let collectionList = this.state.ObjCollection.map(v => (
      <li><a onClick={()=>this.redirectChart(v.id)} className="ember-view">{v.title}</a></li>
    ));
	
/*alert(window.localStorage.length);*/
if (localStorage.getItem('session')) {	  
 return (
	
    <div id="ember361" className="ember-view ember-app"><div className="menu">
        <ul>
          <li className="homeicon"><a>h</a></li>
          <li className="back"><a>M</a></li>
          <li className="titlebar">{this.state.ObjOrganization}</li>
          <li className="logout"><a onClick= {this.logout}>o<span className="text">Logout</span></a></li>
          <li className="profile" onClick={this.GotoProfile}><a>u<span className="text">Profile</span></a></li>
          <li className="docs" onClick={this.GotoDoc}><a>d<span className="text">Docs</span></a></li>
          <li className="help" onClick={this.GotoHelp}><a>?<span className="text">Help</span></a></li>
          <li className="admin" onClick={this.Gotoorg}><a  >c<span className="text">Admin</span></a></li>
        </ul>
      </div>
      <div id="application">
        <ul className="collections">
          <li className="messageButtonCell">
            <a className="ember-view danger intruder" onClick={this.GotoEmergency}><div className="buttonText">Emergency</div></a>
            <a className="ember-view danger" onClick={this.GotoShooter} style={{marginLeft:3,}}><div className="buttonText">Active Shooter</div></a>
          </li>
          <li className="messageButtonCell">
            <a className="ember-view" onClick={this.GotoSendMessage}><div className="buttonText">Send Message</div></a>
            <a className="ember-view" onClick={this.GotoViewMessage} style={{marginLeft:3,}}><div className="buttonText">View Messages</div></a>
          </li>
		  
		 {collectionList}
        
        </ul>
      
      <div id="welcome">
        <div className="header">
          <div className="content">
          
            <div className="orgLogo-container">
              <img className="orgLogo" src="./assets/images/Arodek_logo_new.JPG"/>
            </div>
          
          </div>
        </div>
        <div className="about">
          <h2>Mobile Emergency Response Plan (M.E.R.P.)</h2>
          <p>The MERP is designed to make your emergency plans and related information portable, immediately accessible, and easily revisable. It is available as both an online and mobile application. It provides your personnel with the tasks to be performed in the critical first moments of an incident. You can also add information to assist in your planning and recovery efforts.</p>
          <p>The MERP comes pre-loaded with content that is based upon best practices identified by emergency services agencies. This information is displayed in a simple task-based format. Simply add text and documents to customize the MERP to further meet the needs of your Organization.</p>
        </div>
        <div className="copyright">
          Copyright © 2018 Safeguard Risk Solutions LLC<br/><strong>Patent Pending</strong>
        </div>
      </div>
      
      </div>
      
      </div>
    );
} else {
 window.location.href = '/';
}	
  }
}

export default Collection;
