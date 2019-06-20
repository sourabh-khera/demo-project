import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
class messages extends Component {
    constructor(props){
        super(props);
        this.state = {
		   isLoggedIn: false,
		   messages_template: {},
		   ObjMessages: [],
		   ObjMessagesList: [],
		   fields: {},
		   render: false
        }
		this.redirectDashboard=this.redirectDashboard.bind(this);
		this.replyMessage=this.replyMessage.bind(this);
     }

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
  
  componentDidMount(){
  this.viewMessageList();
  }
  
  redirectDashboard(){
  this.props.history.push('/Collection');
  }
  replyMessage(messageid)
  {
	  this.props.history.push('/messages?id=' + messageid);
  }
  
  handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  let userid = session_array.id;
	  let organizationid = session_array.organization_id;
	  const query = new URLSearchParams(this.props.location.search);
      const id = query.get('id');
     //param 
     fields["action"]="replyMessage";
	 fields["userid"]=userid;
	 fields["organizationid"]=organizationid;
	 fields["conversation_id"]=id;
      //message
      if(!fields["message"]){
         formIsValid = false;
         errors["message"] = "failed to send message";
      }
     this.setState({errors: errors});
     return formIsValid;
    }
	
  handleChangeName(field, e){         
  let fields = this.state.fields;
  fields[field] = e.target.value;        
  this.setState({fields});
  }
  messageSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
        this.replyMessageApi();
        console.log(this.state.fields);
      }else{
         alert("failed to send message");
      }
    }
  
  replyMessageApi()
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
	
  viewMessageList()
  {
	  let safeguard_messages = localStorage.getItem("safeguard_messages");
      let safeguard_messages_array=JSON.parse(safeguard_messages);
	  this.setState({
      ObjMessagesList: safeguard_messages_array.conversation
      })
  }
  
  
 
render() {
if (localStorage.getItem('session')) {
const query = new URLSearchParams(this.props.location.search);
const id = query.get('id');
let messageList;
if(id!=undefined)
{
messageList = this.state.ObjMessagesList.map(v => (
        <li className={v.unread!='false' ? "" : "byUser"}>
              <div className="msg-inner">
                  <div className="msg-header">
                    <div className="msg-sender">
                        <h4>{v.sender.first_name} {v.sender.last_name}</h4>
                      <strong>{v.metadata.group}</strong>
                    </div>
                    <div className="msg-time">{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(v.last_message_at).getTime())}</div>
                  </div>
                  <div className="msg-body">{v.snippet}</div>
                  <div className="clear"></div>
                </div>
          </li>
    ));
}else
{	
messageList = this.state.ObjMessagesList.map(v => (
            <li className={v.unread!='false' ? "unread" : ""}>
            <a className="ember-view" onClick={()=>this.replyMessage(v.id)}>
              <div className="msg-replied">
                <span className="icon">
                 {v.unread!='false' ?  '✓' : '—'}
                </span>
              </div>
              <div className="msg-inner">
                  <div className="msg-header">
                    <div className="msg-sender">
                        <h4>{v.sender.first_name} {v.sender.last_name}</h4>
                      <strong>{v.metadata.group}</strong>
                    </div>
                    <div className="msg-time">{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date(v.last_message_at).getTime())}</div>
                  </div>
                  <div className="msg-body">{v.snippet}</div>
                  <div className="clear"></div>
                </div>
              </a>
              <button className="delete">x</button>
              <div className="clear"></div>
          </li>
    ));	
}
	
 return (
    <div id="ember361" className="ember-view ember-app">
	<div className="menu">
        <ul>
          <li className="home"><a onClick= {this.redirectDashboard}>h</a></li>
          <li className="back"><a>M</a></li>
          <li className="titlebar">Messages</li>
          <li className="refresh"><a>⟳</a></li>
          <li className="edit">
            <a>Edit</a>
          </li>
        </ul>
      </div>
	
    {id!=undefined ?
	<div id="application">
	<div class="conversation">
        <ul className="messages">
		{messageList}
        <li class="replymessage">
      <form acceptCharset="UTF-8"
	   name="messageForm"
	   onSubmit= {this.messageSubmit.bind(this)}>
        <span>Reply</span>
        <input id="ember" class="ember-view ember-text-field" type="hidden" name="conversation_id" value={id} />
        <textarea id="ember"
		class="ember-view ember-text-area js-auto-size"
		name="message"
		onChange={this.handleChangeName.bind(this, "message")}
        value={this.state.fields["message"]}>
		</textarea><br/>
        <button class="message-button" data-ember-action="19887">Send Message</button>
      </form>
    </li>
        </ul>
      </div>
	  </div>
	:
		<div id="application">
        <ul className="messages messages-index">
		{messageList}
        <li className="messageButtonCell">
          <a className="ember-view message-button message-button-center">Send a Message</a>
        </li>
        </ul>
      </div>
	}
      
	  
      </div>
    );
} else {
 window.location.href = '/';
}	
}
}
export default messages;