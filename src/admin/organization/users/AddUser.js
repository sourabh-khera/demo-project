import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class AddUser extends Component {
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
		showAlert: false,
        fields: {},
        organization_template: {},
        group_template: {},
        error: {}

        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
        this.redirectUser=this.redirectUser.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
     }

     componentDidMount() {
      this.GetOrganizationDetail();
      this.GetGroupList();
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
	  
	  let user_password_lock_checked = document.getElementById('user_password_lock').checked;
	  let user_organization_admin_checked = document.getElementById('user_organization_admin').checked;
	  let user_admin_checked = document.getElementById('user_admin').checked;
	  let user_active_checked = document.getElementById('user_active').checked;
	  
	  fields["user_active"] = user_active_checked;
	  fields["user_password_lock"] = user_password_lock_checked;
	  fields["user_organization_admin"] = user_organization_admin_checked;
	  fields["user_admin"] = user_admin_checked;
	  
     //action 
     fields["action"]="createUser";
     fields["organization_id"]=token;

     if (this.refs.groupid) {
       console.log(this.refs.groupid.value);
       fields["user_group_id"]=this.refs.groupid.value;
    }

     //Email
     if(!fields["user_email"]){
      formIsValid = false;
      errors["user_email"] = "Cannot be empty";
   }
 
   if(typeof fields["user_email"] !== "undefined"){
      let lastAtPos = fields["user_email"].lastIndexOf('@');
      let lastDotPos = fields["user_email"].lastIndexOf('.');
 
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["user_email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["user_email"].length - lastDotPos) > 2)) {
         formIsValid = false;
         errors["user_email"] = "Email is not valid";
       }
  }  
      //user_first_name
      if(!fields["user_first_name"]){
         formIsValid = false;
         errors["user_first_name"] = "Cannot be empty";
      }
      //user_last_name
      if(!fields["user_last_name"]){
        formIsValid = false;
        errors["user_last_name"] = "Cannot be empty";
     }

    //password
    if(!fields["user_password"]){
      formIsValid = false;
      errors["user_password"] = "Cannot be empty";
   }
   //Confirm Password
   if(!fields["user_password_confirmation"]){
    formIsValid = false;
    errors["user_password_confirmation"] = "Cannot be empty";
 }  
     this.setState({errors: errors});

     return formIsValid;
    }
    
    userSubmit(e){
      e.preventDefault();
    if(this.handleValidation()){
        this.createUserApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleUserOrganizationAdmin(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleUserAdmin(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handlePasswordLock(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleUserActive(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleChangeName(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }
    
    GetGroupList(){
      let group_template = this.state.group_template;
      let ObjGroup = this.state.ObjGroup;
      group_template["action"]="getGroupList";
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
      group_template["organizationid"]=organizationid;
      fetch(global.api_url,
         {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(this.state.group_template)
         })
          .then((response) => response.json())
          .then((response) => { 
            const status=response.status;
            const group_details = response.group_details;
           if(status === "true")
           {
            this.setState({
              ObjGroup: response.group_details
          })
           }       
     });
     
    }
    createUserApi()
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
           const message = response.text;
		   const code = response.code;
           if(code === "200")
           {
              this.props.history.push('/users/User?organization='+token+'&action=created');
           }
           else if(code === "404"){
              this.setState({
			  showAlert : true			
			  })
           }else{
			   alert(message);
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

  render() {
    let optionTemplate = this.state.ObjGroup.map(v => (
      <option value={v.id}>{v.name}</option>
    ));
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
          <li><a className="home1" onClick={this.redirectDashboard} data-original-title="">Arodek</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
              <li className="active"><a onClick={this.redirectOrganization} data-original-title="">Admin</a></li>
            <li><a data-original-title="">Edit Profile</a></li>
            <li><a onClick= {this.logout} rel="nofollow" data-original-title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
  <div className="container">
        <div className="row">
          <div className="col-xs-12">
          <a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » <a onClick={this.redirectUser} data-original-title="">Users</a>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            
         <h2>{this.state.ObjOrganizations} » New User</h2>
		 {
			 this.state.showAlert?
			 <div class="alert alert-danger">Email has already been taken</div>
			 :null
		 }
		 
		 
  
  <form acceptCharset="UTF-8" 
  className="new_user"
  id="new_user"
  onSubmit= {this.userSubmit.bind(this)} >
    
  <div className="form-group">
    <label htmlFor="user_first_name">First name</label>:
    <input className="form-control"
    id="user_first_name"
    name="user_first_name"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_first_name")}
    value={this.state.fields["user_first_name"]}
     />
  </div>
  
  <div className="form-group">
    <label htmlFor="user_last_name">Last name</label>:
    <input className="form-control"
    id="user_last_name"
    name="user_last_name"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_last_name")}
    value={this.state.fields["user_last_name"]} />
  </div>
  
  <div className="form-group">
    <label htmlFor="user_email">Email</label>:
    <input className="form-control"
    id="user_email"
    name="user_email"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_email")}
    value={this.state.fields["user_email"]} />
  </div>
  
  <div className="form-group">
    <label htmlFor="user_school">Location</label>:
    <input className="form-control"
    id="user_school"
    name="user_school"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_school")}
    value={this.state.fields["user_school"]}
     />
  </div>
  
  <div className="form-group">
  <label htmlFor="user_group">Group</label>:
  <select className="form-control"
  ref="groupid"
  id="user_group_id"
  name="user_group_id"
  value={this.state.fields["user_group_id"]}
  onChange={this.handleChangeName.bind(this, "user_group_id")}>
  {optionTemplate}
  </select>
  </div>
  
  <div className="form-group">
  <input id="user_organization_admin"
  name="user_organization_admin"
  style={{marginRight:3,}}
  type="checkbox"
  value={this.state.fields["user_organization_admin"]}
  onChange={this.handleUserOrganizationAdmin.bind(this, "user_organization_admin")}
  />
    <label htmlFor="user_organization_admin">Level 1 Admin</label>
  </div>
  <div className="form-group">
  <input id="user_admin"
  name="user_admin"
  style={{marginRight:3,}}
  type="checkbox"
  value={this.state.fields["user_admin"]}
  onChange={this.handleUserAdmin.bind(this, "user_admin")}
  />
    <label htmlFor="user_admin">Level 2 Admin</label>
  </div>
  
  
  <div className="form-group">
    <label htmlFor="user_password">Password</label>
    <input className="form-control"
    id="user_password"
    name="user_password"
    type="password"
	maxLength="8"
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
	maxLength="8"
    onChange={this.handleChangeName.bind(this, "user_password_confirmation")}
    value={this.state.fields["user_password_confirmation"]}
     />
  </div>
  
  <div className="form-group">
  <input id="user_password_lock"
  name="user_password_lock"
  style={{marginRight:3,}}
  type="checkbox"
  value={this.state.fields["user_password_lock"]}
  onChange={this.handlePasswordLock.bind(this, "user_password_lock")}
  />
  <label htmlFor="user_LockPassword">Lockpassword</label>
  </div>
  <div className="form-group">
  <input id="user_active"
  name="user_active"
  style={{marginRight:3,}}
  defaultChecked="true"
  type="checkbox"
  value={this.state.fields["user_active"]}
  onChange={this.handleUserActive.bind(this, "user_active")}
  />
    <label htmlFor="user_active">Active</label>
  </div>
  <div className="form-group">
    <input className="btn btn-success" name="commit" type="submit" value="Save"/>&nbsp;
    <a className="btn btn-default" data-original-title="" title="">Cancel</a>
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
export default AddUser;