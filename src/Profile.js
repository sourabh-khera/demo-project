import React, { Component } from 'react';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';


class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:null,
            password:null,
            newpassword:null,
            confirmpassword:null,
            userid:null,
            organizationid:null
        }
        this.GotoHome=this.GotoHome.bind(this);
        this.updatepassword=this.updatepassword.bind(this);
     }

     componentDidMount(){

        let sessiondata= localStorage.getItem("session");
        let sdata=JSON.parse(sessiondata);

        this.setState({
            userid: sdata.id,
            organizationid:sdata.organization_id,
            email:sdata.email
        })
     }

     updatepassword(e){
        e.preventDefault();

        if(this.state.email === null){
            alert("Please enter email");      
        }
       else if(this.state.password === null){
            alert("Please enter Oldpassword");  
        }
        else if(this.state.newpassword === null ){
            alert("Please enter new password");   
        }
        else if(this.state.newpassword.length < 8 ){
            alert("Please enter minimum is 8 characters");   
        }
       
        else if(this.state.confirmpassword === null){
            alert("Please enter confirm password");
        }
        else if(this.state.confirmpassword.length < 8 ){
            alert("Please enter minimum is 8 characters");   
        }
        else if(this.state.newpassword != this.state.confirmpassword){

          alert("Password confirmation doesn't match Password. Password is too short (minimum is 8 characters)")
        }
        else{
            
            var data={
                "action": "editProfile",
                "userid":this.state.userid,
                "organizationid": this.state.organizationid,
                "user_email": this.state.email,
                "current_password": this.state.password,
                "new_password": this.state.newpassword     
                }

           console.log(data);

            fetch(global.api_url,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                    
                })

                 .then((response) => response.json())
                 .then((response) => { 

                    this.GotoHome();

                console.log(response);
                 })
        }
     }


     handlenewpassword(field, e){

        this.setState({
            newpassword:e.target.value
        })
     }
     handleconfirmpassword(field, e){
        this.setState({
            confirmpassword:e.target.value
            })
            }
     handleChange(field, e){         

            if(field === "email"){
                this.setState({
                email:e.target.value
            })
            
           
            }
           else if(field === "password"){
                    this.setState({
                        password:e.target.value
                    })
            }
          
         
      }

     GotoHome(){
        this.props.history.push('/Collection');
    
      }

     render(){
         return(
            <div  className="ember-view ember-app">
            <div className="menu">
                <ul>
                  <li onClick= {this.GotoHome} className="home"><a>h</a></li>
                  <li className="back"><a>M</a></li>
                  <li className="titlebar">Arodek</li>
                  <li onClick= {this.GotoHome} className="logout"><a data-ember-action="1402">o</a></li>
                </ul>
              </div>
              <div className="update-profile">
                <h2>Update Profile</h2>
                <p>Leave Password fields blank if you do not want to change your password.</p>
                <form onSubmit= {this.updatepassword}>
                  <input 
                  onChange={this.handleChange.bind(this,"email")} 
                  value={this.state.email}
                  className="ember-view ember-text-field" 
                  placeholder="Email Address" 
                  autoCapitalize="off" 
                  autoCorrect="off"
                  type="text"
                  />

                  <input 
                  onChange={this.handleChange.bind(this, "password")}
                  value={this.state.password}
                  className="ember-view ember-text-field" 
                  placeholder="Current Password" 
                  type="password"
                  />
                  <input 
                  
                  onChange={this.handlenewpassword.bind(this, "newpassword")}
                  value={this.state.newpassword}
                  className="ember-view ember-text-field" 
                  placeholder="Password" 
                  type="password"/>
                  <input 
                 
                  onChange={this.handleconfirmpassword.bind(this, "confirmpassword")} 
                  value={this.state.confirmpassword}
                  className="ember-view ember-text-field" 
                  placeholder="Password Confirmation" 
                  type="password"/>
                  <button >Update</button>
                </form>
              </div>
              
              </div>
         );
     }
    }
    export default Profile;