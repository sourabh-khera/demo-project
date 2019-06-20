import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
class shooter extends Component {
    constructor(props){
        super(props);
        this.state = {
		   ObjLocation: [],	
		   isLoggedIn: false,
		   message:'',
		   group:'',
		   destination:'',
		   replyall:'',
		   fields: {},
		   render: false
        }
		this.redirectDashboard=this.redirectDashboard.bind(this);
     }

    logout() {
    if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
  
  componentDidMount(){
  this.getLocationList();	  
  }
   getLocationList()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjLocation: session_array.location
      })
  }
  handleChangeName(field, e){         
  let fields = this.state.fields;
  fields[field] = e.target.value;        
  this.setState({fields});
  }
  redirectDashboard(){
  this.props.history.push('/Collection');
  }
  handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
	  let res = this.menu.value;
	  let destination = this.destination.value;
	  let replyall = this.replyall.value;
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  let userid = session_array.id;
	  let organizationid = session_array.organization_id;
     //param 
     fields["action"]="sendMessage";
	 fields["group"]=res;
	 fields["destination"]=destination;
	 fields["replyall"]=replyall;
	 fields["userid"]=userid;
	 fields["organizationid"]=organizationid;
      //message
      if(!fields["message"]){
         formIsValid = false;
         errors["message"] = "failed to send message";
      }
     this.setState({errors: errors});
     return formIsValid;
    }
	
  messageSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
        this.createMessageApi();
        console.log(this.state.fields);
      }else{
         alert("failed to send message");
      }
    }
	
  createMessageApi()
  {
      fetch(global.api_url,
      {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'                 
          },
          body: JSON.stringify(this.state.fields)
      })
      .then((response) => response.json())
      .then((response) => {

           const status=response.status;
           if(status === "true")
           {
              this.props.history.push('/messages');
           }
           else{
              alert("Something went wrong, please try again");
           }
      });
    }
 
  render() {
if (localStorage.getItem('session')) {
let locationList = this.state.ObjLocation.map(v => (
	  <option value={v.id}>{v.name}</option>
    ));	
 return (
    <div id="ember361" className="ember-view ember-app"><div className="menu">
        <ul>
          <li className="home"><a onClick= {this.redirectDashboard}>h</a></li>
          <li className="back"><a>M</a></li>
          <li className="titlebar">Messages</li>
          <li className="refresh"><a>⟳</a></li>
          <li className="edit"><a>Edit</a></li>
        </ul>
      </div>
      <div id="application">
        <div className="conversation">
        <ul class="messages">
		
		  <form name="messageForm">
          <li className="composemessage urgent">
            <span>Urgent Message</span>
            <div className="select-wrapper">
              <select name="urgenttype">
                <option value="shooter" selected="selected">Active Shooter</option>
                <option value="emergency">Emergency</option>
                <option value="intruder">Intruder</option>
              </select>
            </div>
            <span>Custom Message (Optional)</span>
            <textarea className="ember-view ember-text-area js-auto-size" name="custommessage"></textarea>
            <button className="message-button">Send Message</button>
          </li>
        </form>
		
        </ul>
      </div>
      </div>
      </div>
    );
} else {
 window.location.href = '/';
}	
}
}
export default shooter;