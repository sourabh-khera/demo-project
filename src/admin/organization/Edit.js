import React, { Component } from 'react';
import Select from 'react-select';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Edit extends Component {
        constructor(props){
        super(props);
        this.state = {
        organization_name: '',
        organization_active: 'true',
        organization_messaging_enabled: 'false',
        fileName: '',
        ObjOrganizations: {},
        organization_logo: null,
        fields: {},
        organization_template: {},
        error: {},
		ObjOrganization: ''
        }
		this.redirectDashboard=this.redirectDashboard.bind(this);
		this.redirectOrganization=this.redirectOrganization.bind(this);
		this.editProfile=this.editProfile.bind(this);
     }
     redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
	 redirectOrganization(){
     this.props.history.push('/Organization');
     }
	 editProfile(user_id,organizationid){
	 this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
     }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
    
     //action 
     fields["action"]="editOrganization";
     
     //organizationid
     const query = new URLSearchParams(this.props.location.search);
     const organizationid = query.get('organization');
     fields["organizationid"]=organizationid;
     
     let organization_name = document.getElementById('organization_name').value;
     let organization_active_isChecked = document.getElementById('organization_active').checked;
     let organization_messaging_enabled_isChecked = document.getElementById('organization_messaging_enabled').checked;
     fields["organization_active"] = organization_active_isChecked;
     fields["organization_messaging_enabled"] = organization_messaging_enabled_isChecked;
    
      //organization_name
      if(organization_name==''){
         formIsValid = false;
         errors["organization_name"] = "Cannot be empty";
      }else{
        fields["organization_name"]=organization_name;
      }
      //organization_logo
      if(!fields["organization_logo"]){
        fields["organization_logo"]=this.state.ObjOrganizations.logo;
     }
     this.setState({errors: errors});

     return formIsValid;
    }
    
    organizationSubmit(e){
      e.preventDefault();
    if(this.handleValidation()){
      console.log(this.state.fields);
      this.editOrganizationApi();
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    
    handleChangeMessageEnable(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;

      if(isChecked==true)
      {
        //this.state.ObjOrganizations.active = 1;
        document.getElementById('organization_messaging_enabled').value = '1';
      }else
      {
        //this.state.ObjOrganizations.active = 0;
        document.getElementById('organization_messaging_enabled').value = '0';
      }
    }
    handleChangeName(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }
    handleChange(field, e){     
      let fields = this.state.fields;
      let isChecked = e.target.checked;

      if(isChecked==true)
      {
        this.state.ObjOrganizations.active = 1;
        document.getElementById('organization_active').value = '1';
      }else
      {
        this.state.ObjOrganizations.active = 0;
        document.getElementById('organization_active').value = '0';
      }
    }


    uploadFile(field, e) {
      let fields = this.state.fields;
    switch (e.target.name) {
      case 'organization_logo':
      	if(e.target.files.length > 0) {
        
          this.setState({ fileName: e.target.files[0].name });
          fields[field] = e.target.files[0].name;
          this.setState({fields});
        }
      break;
      default:
        this.setState({ [e.target.name]: e.target.value });
     } 
   }

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
    
    componentDidMount() {
      this.GetOrganizationDetails();
	  this.getOrganizationName();
  }
  
  getOrganizationName()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }   

  editOrganizationApi()
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
              this.props.history.push('/Organization');
           }
           else{
              alert("Something went wrong, please try again");
           }
      });
    }
    GetOrganizationDetails(){
      let organization_template = this.state.organization_template;
      let ObjOrganizations = this.state.ObjOrganizations;
      organization_template["action"]="detailOrganization";
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
            const details = response.details;
           if(status === "true")
           {
            this.setState({
              ObjOrganizations: response.details
          })
           }       
     });
     
 }

  render() {
	  let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	  
    let active_checkbox;
    let messaging_enabled_checkbox;
    let active_checkbox_val = this.state.ObjOrganizations.active;
    let messaging_enabled_val = this.state.ObjOrganizations.messaging_enabled;
    if(active_checkbox_val == 1){
       active_checkbox = (
  <input
  type="checkbox"
  defaultChecked="true"
  id="organization_active"
  name="organization_active" />
       );
    }else if(active_checkbox_val == 0){
      active_checkbox = (
        <input
        type="checkbox"
        id="organization_active"
        name="organization_active" />
             );
    }else{
  
    }
  
    if(messaging_enabled_val == 1){
  
      messaging_enabled_checkbox = (
  <input
   id="organization_messaging_enabled" 
   name="organization_messaging_enabled" 
   type="checkbox"
   defaultChecked="true" />
      );
   }else if(messaging_enabled_val == 0){
    messaging_enabled_checkbox = (
       <input
   id="organization_messaging_enabled" 
   name="organization_messaging_enabled" 
   type="checkbox"/>
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
          <li><a class="home1" onClick={this.redirectDashboard} data-original-title="" title="">{this.state.ObjOrganization}</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
              <li class="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li class=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
            <li><a data-confirm="Are you sure you want to log out?" onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Organizations
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h2>Edit Organization</h2>
  
  <form name="edit_organization_223"
  onSubmit= {this.organizationSubmit.bind(this)}
  accept-charset="UTF-8" 
  class="edit_organization" 
  enctype="multipart/form-data" 
  id="edit_organization_223" 
  >
  <div>
  <input name="utf8" type="hidden" value="✓"/>
  <input name="_method" type="hidden" value="patch"/>
  <input name="authenticity_token" type="hidden" value="7nUpKeritrsJ9pkFYTZ8CX1NBP1Q6fa7BUN3rUjqgpI="/>
  </div>
  <div class="form-group">
    <label for="organization_name">Name</label>:
    <input class="form-control"
    placeholder="Organization Name"
     id="organization_name" 
     name="organization_name"
     type="text" 
     onChange={this.handleChangeName.bind(this, "organization_name")}
     defaultValue ={this.state.ObjOrganizations.name}
     />
  </div>
  <div class="form-group">
  {active_checkbox}&nbsp;
<label for="organization_active">Active</label>
 </div>

 <div class="form-group" style={{marginBottom:10}}>
  {messaging_enabled_checkbox}&nbsp;
  <label for="organization_messaging_enabled">Messaging enabled</label>
</div>
  
<div class="form-group">
    <label style={{marginBottom:2,}}>Logo</label>
      <div class="row">
        <div class="col-md-6">
          <label>View File</label>
		  
          <a class="btn btn-primary btn-block" href={this.state.ObjOrganizations.filepath} target="_blank">{this.state.ObjOrganizations.logo}</a>
		 
        </div>
        <div class="col-md-6">
          <label>Replace Logo</label>
          <input class="btn btn-block file-inputs file"
           data-filename-placement="inside"
           data-show-upload="false"
          hide_label="true" id="organization_logo"
          name="organization_logo"
          title="Replace"
          onChange={this.uploadFile.bind(this, "organization_logo")}
          type="file"/>
        </div>
      </div>
  </div>
  <hr/>
  <div class="form-group">
    <input class="btn btn-success" name="commit" type="submit" value="Save"/>&nbsp;
    <a class="btn btn-default" href="" data-original-title="" title="">Cancel</a>
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

export default Edit;
