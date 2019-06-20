import React, { Component } from 'react';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FilePond, registerPlugin } from 'react-filepond';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Variables extends Component {
    constructor(props){
        super(props);
        this.state = {
        organization_name: '',
        organization_active: 'false',
        organization_messaging_enabled: 'false',
        template_id: '',
        fileName: '',
        ObjOrganizations: [],
		ObjVariables: [],
        organization_logo: null,
        fields: {},
        organization_template: {},
		variable_template: {},
		variable_delete_template: {},
		ObjOrganization: '',
        error: {}

        }
		this.redirectDashboard=this.redirectDashboard.bind(this);
		this.redirectOrganization=this.redirectOrganization.bind(this);
     }

     redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
	 redirectOrganization(){
     this.props.history.push('/Organization');
     }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
    
     //action 
     fields["action"]="createOrganization";
    
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

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
  
  getOrganizationName()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }  
    
    componentDidMount() {
      this.GetOrganizationList();
	  this.GetVariableList();
	  this.getOrganizationName();
  }
  
  deleteVariableSubmit(variableid,organizationid)
{
	  confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete this Content Variable',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.deleteVariable(variableid,organizationid)
        },
        {
          label: 'No',
        }
      ]
    });
}

deleteVariable(variableid,organizationid)
{ 
let variable_delete_template = this.state.variable_delete_template;
variable_delete_template["variableid"]=variableid;
variable_delete_template["organizationid"]=organizationid;
variable_delete_template["action"]="deleteVariable";

fetch(global.api_url,
  {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.variable_delete_template)
  })
   .then((response) => response.json())
   .then((response) => { 
     const status=response.status;
    if(status === "true")
    {
	   window.location.reload();
    }       
});
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
 
    GetVariableList(){
      let variable_template = this.state.variable_template;
      let ObjVariables = this.state.ObjVariables;
	  const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
      variable_template["action"]="getVariableList"; 
	  variable_template["organizationid"]=organizationid;
      fetch(global.api_url,
         {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(this.state.variable_template)
         })
          .then((response) => response.json())
          .then((response) => { 
            const status=response.status;
            const variable_list = response.list;
           if(status === "true")
           {
            this.setState({
              ObjVariables: variable_list
          })
           }       
     });
     
 }
    

  render() {
	  const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  let variableList = this.state.ObjVariables.map(v => (													   
      <div class="row variable-row" data-id="{v.id}">
                  <div class="col-xs-3">
                    <input type="text"
					name="original_name"
					defaultValue={v.original_name}
					class="form-control" />
                  </div>
                  <div class="col-xs-2">
                    <input type="text"
					name="lookup_code"
					defaultValue={v.lookup_code}
					class="form-control" />
                  </div>
                  <div class="col-xs-3">
                    <textarea name="description"
					class="form-control">{v.description}</textarea>
                  </div>
                  <div class="col-xs-3">
                    <input type="text"
					name="full_name"
					id="full_name"
					defaultValue={v.full_name}
					class="form-control" />
                  </div>
                  <div class="col-xs-1">
                  <a class="btn btn-danger" onClick={()=>this.deleteVariableSubmit(v.id,organizationid)} data-method="DELETE" data-remote="true" rel="nofollow" data-original-title="" title="">Delete</a>
                  </div>
                  </div>
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
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Organizations
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          <h2>Edit Content Variables</h2>

	  <hr/>
          <form accept-charset="UTF-8"
		  class="edit_organization"
		  id="edit_organization_212"
		  method="post">
            <div>
              <input name="utf8" type="hidden" value="✓" />
              <input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M=" />
            </div>
             
            <div class="row">
              <div class="col-xs-3">
                <h4>Content Variable Name</h4>
              </div>
              <div class="col-xs-2">
                <h4>Content Variable Code</h4>
              </div>
              <div class="col-xs-3">
                <h4>Variable Description</h4>
              </div>
              <div class="col-xs-3">
                <h4>Variable Value</h4>
              </div>
            </div>
            <div class="row">
              <br />
            </div>
            <div class="variables-container">
              {variableList}
			  <br />
            </div>
            
            <div class="form-group">
              <input class="btn btn-success" name="commit" type="submit" value="Save" />&nbsp;
              <a class="btn btn-default" data-original-title="" title="">Cancel</a>
              <a class="btn btn-primary pull-right" data-remote="true" data-original-title="" title="">Add Variable</a>
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
export default Variables;