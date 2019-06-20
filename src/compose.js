import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
class compose extends Component {
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
        <ul className="messages messages-inner">
		  <form acceptCharset="UTF-8"
		  onSubmit= {this.messageSubmit.bind(this)}
		  name="messageForm"
		  id="messageForm">
          <li className="composemessage">
            <span>Send a Message</span>
            <textarea id="ember1961"
			className="ember-view ember-text-area js-auto-size"
			name="message"
			onChange={this.handleChangeName.bind(this, "message")}
            value={this.state.fields["message"]}
			></textarea>
            <span>Group / Building (optional)</span>
            <div className="select-wrapper">
              <select 
			  name="group"
			  disabled={true}
			  ref = {(input)=> this.menu = input}
			  value={this.state.fields["group"]}
              onChange={this.handleChangeName.bind(this, "group")}>
                  {locationList}
              </select>
            </div>
            <span>Send to All / Incident Commanders</span>
            <div className="select-wrapper">
              <select 
			  name="destination"
			  ref = {(input)=> this.destination = input}
			  value={this.state.fields["destination"]}
              onChange={this.handleChangeName.bind(this, "destination")}>
                <option value="commander">Incident Commanders</option>
                <option value="all">All</option>
              </select>
            </div>
            <span>Reply to All / Sender Only</span>
            <div className="select-wrapper">
              <select
			  name="replyall"
			  ref = {(input)=> this.replyall = input}
			  value={this.state.fields["replyall"]}
              onChange={this.handleChangeName.bind(this, "replyall")}>
                <option value="all">Reply All</option>
                <option value="sender">Sender Only</option>
              </select>
            </div><br/>
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
export default compose;