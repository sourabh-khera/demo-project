import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class EditUser extends Component {
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
     }

     componentDidMount() {
      this.GetOrganizationDetail();
      this.GetGroupList();
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
      const userid = query.get('user');
     //action 
     fields["action"]="editUser";
     fields["organizationid"]=token;
     fields["userid"]=userid;
     

     let user_first_name_value = document.getElementById('user_first_name').value;
     let user_last_name_value = document.getElementById('user_last_name').value;
     let user_email_value = document.getElementById('user_email').value;
     let user_school_value = document.getElementById('user_school').value;

     fields["user_first_name"] = user_first_name_value;
     fields["user_last_name"] = user_last_name_value;
     fields["user_email"] = user_email_value;
     fields["user_school"] = user_school_value;

     let user_password_value = document.getElementById('user_password').value;
     let user_password_confirmation_value = document.getElementById('user_password_confirmation').value;

     fields["user_password"] = user_password_value;
     fields["user_password_confirmation"] = user_password_confirmation_value;

     let user_organization_admin_checked = document.getElementById('user_organization_admin').checked;
     let user_admin_checked = document.getElementById('user_admin').checked;
     let user_password_lock_checked = document.getElementById('user_password_lock').checked;
     let user_active_checked = document.getElementById('user_active').checked;

     fields["user_organization_admin"] = user_organization_admin_checked;
     fields["user_admin"] = user_admin_checked;
     fields["user_password_lock"] = user_password_lock_checked;
     fields["user_active"] = user_active_checked;



     if (this.refs.groupid) {
       console.log(this.refs.groupid.value);
       fields["user_group_id"]=this.refs.groupid.value;
    }

     //Email
     if(!fields["user_email"]){
      formIsValid = false;
      errors["user_email"] = "Cannot be empty";
   }
   if(user_password_value!=user_password_confirmation_value)
   {
    formIsValid = false;
    errors["user_password"] = "not matching";
   }
 
   if(typeof fields["user_email"] !== "undefined"){
      let lastAtPos = fields["user_email"].lastIndexOf('@');
      let lastDotPos = fields["user_email"].lastIndexOf('.');
 
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["user_email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["user_email"].length - lastDotPos) > 2)) {
         formIsValid = false;
         errors["user_email"] = "Email is not valid";
       }
  }  
      
     /*if(user_password!=user_password_confirmation)
     {
      formIsValid = false;
      errors["user_password"] = "Can not mach with user confirm password";
      errors["user_password_confirmation"] = "Can not mach with user password";
     }*/

     this.setState({errors: errors});

     return formIsValid;
    }
    
    userSubmit(e){
      e.preventDefault();
      console.log(this.state.fields);
    if(this.handleValidation()){
        this.editUserApi();
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
              this.props.history.push('/users/User?organization='+ token);
           }
           else{
              alert('update not successfully');
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
    const userid = query.get('user');
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
    let optionTemplate = this.state.ObjGroup.map(v => (
      <option value={v.id}>{v.name}</option>
    ));
    let level1_admin_checkbox;
    let level2_admin_checkbox;
    let user_active;
    let user_password_lock;
    let level1_admin_checkbox_val = this.state.ObjUser.organization_admin;
    let level2_admin_checkbox_val = this.state.ObjUser.admin;

    let user_active_val = this.state.ObjUser.active;
    let user_password_lock_val = this.state.ObjUser.password_lock;
    
    if(level1_admin_checkbox_val == 1){
      level1_admin_checkbox = (
  <input
  type="checkbox"
  defaultChecked="true"
 style={{marginRight:3,}}
  id="user_organization_admin"
  name="user_organization_admin" />
       );
    }else if(level1_admin_checkbox_val == 0){
      level1_admin_checkbox = (
        <input
        type="checkbox"
style={{marginRight:3,}}
        id="user_organization_admin"
        name="user_organization_admin" />
             );
    }else{
         }  

      if(level2_admin_checkbox_val == 1){
      level2_admin_checkbox = (
      <input
      type="checkbox"
      defaultChecked="true"
style={{marginRight:3,}}
      id="user_admin"
      name="user_admin" />
           );
        }else if(level2_admin_checkbox_val == 0){
          level2_admin_checkbox = (
            <input
            type="checkbox"
            style={{marginRight:3,}}
            id="user_admin"
            name="user_admin" />
                 );
        }else{
             }       

             if(user_active_val == 1){
              user_active = (
          <input
          type="checkbox"
          defaultChecked="true"
          style={{marginRight:3,}}
          id="user_active"
          name="user_active" />
               );
            }else if(user_active_val == 0){
              user_active = (
                <input
                type="checkbox"
                style={{marginRight:3,}}
                id="user_active"
                name="user_active" />
                     );
            }else{
                 }  

    if(user_password_lock_val == 1){
    user_password_lock = (
     <input
    type="checkbox"
    style={{marginRight:3,}}
    defaultChecked="true"
    id="user_password_lock"
    name="user_password_lock" />
          );
      }else if(user_password_lock_val == 0){
        user_password_lock = (
          <input
          type="checkbox"
          style={{marginRight:3,}}
          id="user_password_lock"
          name="user_password_lock" />
                );
      }else{
            } 

    if (localStorage.getItem('session')) {
    return (
        <div class="bodyscroll">
    <div class="navbar navbar-inverse navbar-static-top" role="navigation">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-left">
          <li><a class="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
              <li class="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li class=""><a data-original-title="" title="">Edit Profile</a></li>
            <li><a onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
  <div class="container">
        <div class="row">
          <div class="col-xs-12">
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » <a class="" onClick={this.redirectUser} data-original-title="" title="">Users</a>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            
         <h2>{this.state.ObjOrganizations} » Edit User</h2>
  
  <form accept-charset="UTF-8" 
  class="new_user"
  id="new_user"
  onSubmit= {this.userSubmit.bind(this)} >
    
  <div class="form-group">
    <label for="user_first_name">First name</label>:
    <input class="form-control"
    id="user_first_name"
    name="user_first_name"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_first_name")}
    defaultValue ={this.state.ObjUser.first_name}
     />
  </div>
  
  <div class="form-group">
    <label for="user_last_name">Last name</label>:
    <input class="form-control"
    id="user_last_name"
    name="user_last_name"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_last_name")}
    defaultValue ={this.state.ObjUser.last_name} />
  </div>
  
  <div class="form-group">
    <label for="user_email">Email</label>:
    <input class="form-control"
    id="user_email"
    name="user_email"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_email")}
    defaultValue ={this.state.ObjUser.email} />
  </div>
  
  <div class="form-group">
    <label for="user_school">Location</label>:
    <input class="form-control"
    id="user_school"
    name="user_school"
    type="text"
    onChange={this.handleChangeName.bind(this, "user_school")}
    defaultValue ={this.state.ObjUser.school}
     />
  </div>
  
  <div class="form-group">
  <label for="user_group">Group</label>:
  <select class="form-control"
  ref="groupid"
  id="user_group_id"
  name="user_group_id"
  value={this.state.fields["user_group_id"]}
  onChange={this.handleChangeName.bind(this, "user_group_id")}>
  {optionTemplate}
  </select>
  </div>
  
  <div class="form-group">
  {level1_admin_checkbox}
  <label for="user_organization_admin">Level 1 Admin</label>
  </div>
  <div class="form-group">
  {level2_admin_checkbox}
  <label for="user_admin">Level 2 Admin</label>
  </div>
  <div class="alert alert-warning">Leave Password fields blank if you do not want to change the password</div> 
  
  <div class="form-group">
    <label for="user_password">Password</label>
    <input class="form-control"
    id="user_password"
    name="user_password"
    type="password"
	maxLength="8"
    onChange={this.handleChangeName.bind(this, "user_password")}
    value={this.state.fields["user_password"]}
     />
  </div>
  
  <div class="form-group">
    <label for="user_password_confirmation">Password confirmation</label>
    <input class="form-control"
    id="user_password_confirmation"
    name="user_password_confirmation"
    type="password"
	maxLength="8"
    onChange={this.handleChangeName.bind(this, "user_password_confirmation")}
    value={this.state.fields["user_password_confirmation"]}
     />
  </div>
  
  <div class="form-group">
  {user_password_lock}
  <label for="user_LockPassword">Lockpassword</label>
  </div>
  
  <div class="form-group">
  {user_active}
    <label for="user_active">Active</label>
  </div>
  
  <div class="form-group">
    <input class="btn btn-success" name="commit" type="submit" value="Save"/>&nbsp;
    <a class="btn btn-default" data-original-title="" href="" title="">Cancel</a>
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

export default EditUser;
