import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class EditProfile extends Component {
        constructor(props){
        super(props);
        this.state = {
        user_first_name: '',
        user_last_name: '',
        user_email: '',
        user_school: '',
        user_group_id: '0',
        selectValue: '0',
        user_organization_admin: 'false',
        user_admin: 'false',
        user_password: '',
        user_password_confirmation:'',
        user_password_lock: 'false',
        user_active: 'false',
        organization_id: '',
        ObjOrganizations: [],
        ObjGroup: [],
        ObjUser: [],
        fields: {},
        organization_template: {},
        user_template: {},
        group_template: {},
        error: {}

        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
        this.redirectUser=this.redirectUser.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
		this.editProfile=this.editProfile.bind(this);
     }

     componentDidMount() {
      this.GetOrganizationDetail();
      this.GetUserDetails();
    }
     
	 redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
      const userid = query.get('userid');
     //action 
     fields["action"]="editProfile";
     fields["organizationid"]=token;
     fields["userid"]=userid;

     let user_email_value = document.getElementById('user_email').value;
     let user_password_value = document.getElementById('user_password').value;
	 let user_current_password_value = document.getElementById('user_current_password').value;
     let user_password_confirmation_value = document.getElementById('user_password_confirmation').value;
	 
     fields["user_email"] = user_email_value;
     fields["new_password"] = user_password_value;
     fields["user_password_confirmation"] = user_password_confirmation_value;
	 fields["current_password"] = user_current_password_value;
	 
     if (this.refs.groupid) {
       console.log(this.refs.groupid.value);
       fields["user_group_id"]=this.refs.groupid.value;
    }

     //Email
     if(user_email_value==''){
      formIsValid = false;
      errors["user_email"] = "Cannot be empty";
   }
   if(user_password_value!=user_password_confirmation_value)
   {
    formIsValid = false;
    errors["user_password"] = "Password and Confirm Password not matching";
   }
 
   if(typeof fields["user_email"] !== "undefined"){
      let lastAtPos = fields["user_email"].lastIndexOf('@');
      let lastDotPos = fields["user_email"].lastIndexOf('.');
 
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["user_email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["user_email"].length - lastDotPos) > 2)) {
         formIsValid = false;
         errors["user_email"] = "Email is not valid";
       }
  }

     this.setState({errors: errors});

     return formIsValid;
    }
    
    userSubmit(e){
      e.preventDefault();
      console.log(this.state.fields);
    if(this.handleValidation()){
       this.editUserApi();
      }else{
         alert("Mandatory Field Emplty!");
      }
    }
    handleChangeName(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }
    editProfile(user_id,organizationid)
    {
	 this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
    }
    editUserApi()
    {
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
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
           const query = response.query;
           //const message = response.text;
           if(status === "true")
           {
              localStorage.clear();
              window.location.href = '/';
           }
           else{
              alert('update not done successfully');
           }
      });
    }

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }

  redirectOrganization(){
    this.props.history.push('/Organization');
    }
    redirectUser(){
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
      this.props.history.push('/users/User?organization='+ token); 
    }

  GetOrganizationDetail(){
    let organization_template = this.state.organization_template;
    let ObjOrganizations = this.state.ObjOrganizations;
    organization_template["action"]="getOrganizationDetails"; 
    const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
    organization_template["organizationid"]=organizationid;
    fetch(global.api_url,
       {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(this.state.organization_template)
       })
        .then((response) => response.json())
        .then((response) => { 
          const status=response.status;
          const name = response.name;
         if(status === "true")
         {
          this.setState({
            ObjOrganizations: response.name
        })
         }       
   });
   
  }

    GetUserDetails(){
    let user_template = this.state.user_template;
    let ObjUser = this.state.ObjUser;
    user_template["action"]="detailUser";
    const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
    const userid = query.get('userid');
    user_template["organizationid"]=organizationid;
    user_template["userid"]=userid;  
    fetch(global.api_url,
       {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(this.state.user_template)
       })
        .then((response) => response.json())
        .then((response) => { 
          const status=response.status;
          const details = response.details;
         if(status === "true")
         {
          this.setState({
            ObjUser: response.details
        })
         }       
   });
   
}  


  render() {
	  let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;  
    if (localStorage.getItem('session')) {
    return (
    <div className="bodyscroll">
    <div className="navbar navbar-inverse navbar-static-top" role="navigation">
    <div className="container">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
      <div className="navbar-collapse collapse">
        <ul className="nav navbar-nav navbar-left">
          <li><a className="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
              <li><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li className="active"><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
            <li><a onClick= {this.logout} rel="nofollow" data-original-title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
  <div className="container">
        <div className="row">
          <div className="col-xs-12">
            
         <h2>My Account</h2>
  
  <form acceptCharset="UTF-8" 
  className="new_user"
  id="new_user"
  onSubmit= {this.userSubmit.bind(this)} >
  
  <div className="form-group">
    <label htmlFor="user_email">Email</label>:
    <input className="form-control"
    id="user_email"
    name="user_email"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_email")}
    defaultValue ={this.state.ObjUser.email} />
  </div>
  
  <div className="alert alert-warning">Leave Password fields blank if you do not want to change the password</div> 
  
  <div className="form-group">
    <label htmlFor="user_password">Current Password</label>
    <input className="form-control"
    id="user_current_password"
    name="user_current_password"
    type="password"
	minLength="8"
    onChange={this.handleChangeName.bind(this, "user_current_password")}
    value={this.state.fields["user_current_password"]}
     />
  </div>
  
  <div className="form-group">
    <label htmlFor="user_password">Password</label>
    <input className="form-control"
    id="user_password"
    name="user_password"
    type="password"
	minLength="8"
    onChange={this.handleChangeName.bind(this, "user_password")}
    value={this.state.fields["user_password"]}
     />
  </div>
  
  <div className="form-group">
    <label htmlFor="user_password_confirmation">Password confirmation</label>
    <input className="form-control"
    id="user_password_confirmation"
    name="user_password_confirmation"
    type="password"
	minLength="8"
    onChange={this.handleChangeName.bind(this, "user_password_confirmation")}
    value={this.state.fields["user_password_confirmation"]}
     />
  </div>  
  <div className="form-group">
    <input className="btn btn-success" name="commit" type="submit" value="Save"/>&nbsp;
    <a className="btn btn-default" data-original-title="" href="" title="">Cancel</a>
  </div>
  
  </form>
          </div>
        </div>
  </div>
  </div>
    );
	}else{
    window.location.href = '/';		
	}
  }
}
export default EditProfile;