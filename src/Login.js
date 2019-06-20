import React,{Component} from 'react';
import Home from './Home';
import { BrowserRouter as Router, NavLink, Switch, Link, Route } from 'react-router-dom';
import Collection from './Collection';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Login extends Component{

    constructor(){
        super();
        this.state = {
          useremail:'',
          userpassword:'',
          isUser:'abc',
          isDialogVisible: false,
		  messages_template : {},
          collections:'',
          email:'',
          id:'',
          school:'',
          fields: {},
          errors: {}
        }
     }


     handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
      
       fields["action"]="userLogin";
      
        //Email
        if(!fields["email"]){
           formIsValid = false;
           errors["email"] = "Cannot be empty";
        }
      
        if(typeof fields["email"] !== "undefined"){
           let lastAtPos = fields["email"].lastIndexOf('@');
           let lastDotPos = fields["email"].lastIndexOf('.');
      
           if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
              formIsValid = false;
              errors["email"] = "Email is not valid";
            }
       }  


        //password
        if(!fields["password"]){
            formIsValid = false;
            errors["password"] = "Cannot be empty";
         }
      
       this.setState({errors: errors});

       return formIsValid;
      }
      
      contactSubmit(e){
        e.preventDefault();
        
        if(this.handleValidation()){

         this.LoginApi();

         console.log(this.state.fields);
        }else{
           alert("Sorry, Wrong Username or Password");
        }
      
      }
      
      handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
      }
	  
  getMessageList(){
  let messages_template = this.state.messages_template;
  let ObjMessages = this.state.ObjMessages;
  let session= localStorage.getItem("session");
  let session_array=JSON.parse(session);
  let organization_id = session_array.organization_id;

  messages_template["action"]="getMessageList";
  messages_template["organization_id"]=organization_id;
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.messages_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const message_list = response.message_list;
       if(status === "true")
       {
		localStorage.setItem('safeguard_messages', JSON.stringify(message_list));  
       }else{
		   localStorage.setItem('safeguard_messages', '');
	   }
 });
 console.log(this.state.ObjMessages);
  }

      LoginApi()
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
				localStorage.setItem('session', JSON.stringify(response.user_details));
				localStorage.setItem('safeguard', JSON.stringify(response.safeguard));
				this.getMessageList();
                this.props.history.push('/Collection');
             }
             else{
                alert("please enter valid user details");
             }
        });
      }

    render(){
        return(
            <div id="ember361"  className="ember-view ember-app"><div  className="login">
            <h2>Mobile Emergency Response Plan</h2>
            <form name="contactform" onSubmit= {this.contactSubmit.bind(this)}>
              <input 
               id="email" 
                className="ember-view ember-text-field logtxt" 
               placeholder="Email Address"
               autoCapitalize="off"
               autoCorrect="off"
               type="text"
               onChange={this.handleChange.bind(this, "email")}
               value={this.state.fields["email"]}
              />
              <input
                id="password" 
                 className="ember-view ember-text-field passwordtxt"
                placeholder="Password" 
                type="password"
		
                onChange={this.handleChange.bind(this, "password")}
                value={this.state.fields["password"]}
                />
              <button 
              id="login" 
              data-ember-action="1537"
              >Sign In</button>
            </form>          
            <a  className="forgot" href="" data-ember-action="1538">Forgot your password?</a>
          </div>
          <div  className="watermark"></div>
          
          </div>  
        );
    }
}

export default Login;