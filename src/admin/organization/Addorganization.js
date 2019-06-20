import React, { Component } from 'react';
import Select from 'react-select';
import { FilePond, registerPlugin } from 'react-filepond';
import axios from 'axios';
import 'filepond/dist/filepond.min.css';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Addorganization extends Component {
    constructor(props){
        super(props);
        this.state = {
        organization_name: '',
        organization_active: 'false',
        organization_messaging_enabled: 'false',
        template_id: '',
		userid:'',
        file: '',
      	selectedFile: null,
        ObjOrganizations: [],
        organization_logo: null,
		filepath: null,
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
	  let res = this.menu.value;
	  let session_element = localStorage.getItem("session");
      let session_array=JSON.parse(session_element);
	  let userid = session_array.id;
    
     //action 
     fields["action"]="createOrganization";
	 fields["template_id"]=res;
	 fields["userid"]=userid;
	 let organization_active_isChecked = document.getElementById('organization_active').checked;
	 fields["organization_active"] = organization_active_isChecked;
	 
      //organization_name
      if(!fields["organization_name"]){
         formIsValid = false;
         errors["organization_name"] = "Cannot be empty";
      }
     this.setState({errors: errors});

     return formIsValid;
    }
    
     organizationSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
	  const data = new FormData()
		data.append('organization_logo', this.state.selectedFile)
		axios.post("http://3.89.110.194:8000/upload", data, {
   })
.then(res => {
     console.log(res.data.path);
	  let fields = this.state.fields;
	  fields["filepath"] = res.data.path;
	  console.log(this.state.fields);
	  this.createOrganizationApi();
  })
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleChange(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleChangeMessageEnable(field, e){         
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
    uploadFile(field, e) {
		this.setState({
        selectedFile: e.target.files[0],
        loaded: 0,
      })
		
      let fields = this.state.fields;
	  let filename = this.state.selectedFile;
	 
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
    
    createOrganizationApi()
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
              this.props.history.push('/Organization?success=true');
           }
           else{
              alert("Something went wrong, please try again");
           }
      });
    }

  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
    
    componentDidMount() {
      this.GetOrganizationList();
	  this.getOrganizationName();
  }
    GetOrganizationList(){
      let organization_template = this.state.organization_template;
      let ObjOrganizations = this.state.ObjOrganizations;
      organization_template["action"]="getOrganizationTemplate"; 
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
            const template = response.template;
           if(status === "true")
           {
            this.setState({
              ObjOrganizations: response.template
          })
           }       
     });
     
 }
 getOrganizationName()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }   

  render() {
	  let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	  
    let optionTemplate = this.state.ObjOrganizations.map(v => (
      <option value={v.id}>{v.name}</option>
    ));
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
              <li class="active"><a data-original-title="" title="">Admin</a></li>
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
          <h2>New Organization</h2>
  
  <form name="edit_organization_223"
  onSubmit= {this.organizationSubmit.bind(this)}
  acceptCharset="UTF-8" 
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
     value={this.state.fields["organization_name"]}
     />
  </div>
  <div class="form-group">
  <input 
  onChange={this.handleChange.bind(this,'organization_active')}
  type="checkbox"
  value={this.state.fields["organization_active"]}
  id="organization_active"
  checked = "checked"
  name="organization_active" />&nbsp;
<label for="organization_active">Active</label>
 </div>

 <div class="form-group" style={{marginBottom:13}}>
  <input
   id="organization_messaging_enabled" 
   name="organization_messaging_enabled" 
   type="checkbox" 
   value={this.state.fields["organization_messaging_enabled"]}
   onChange={this.handleChangeMessageEnable.bind(this, "organization_messaging_enabled")}
   />&nbsp;
  <label for="organization_messaging_enabled">Messaging enabled</label>
</div>
 <div class="form-group" style={{marginBottom:13}}>
    <label for="template_id">Template Organization</label>

<select
class="form-control"
name="template_id"
id="template_id"
ref = {(input)=> this.menu = input}
value={this.state.fields["template_id"]}
onChange={this.handleChangeName.bind(this, "template_id")}> 
{optionTemplate}
</select>
</div>
  
  <div class="form-group">
    <label>Logo</label>
    
      <div class="row">
        <div class="col-md-12">
          <input 
          class="btn btn-primary btn-block file-inputs file"
          id="organization_logo"
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

export default Addorganization;
