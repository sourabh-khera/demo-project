import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
const options = [];
const seleted_ids=[];

class AddFileFolder extends Component {
    constructor(props){
        super(props);
        this.state = {
        name: '',
        ObjOrganizations: [],
        ObjGroup: [],
     
        fields: {},
        organization_template: {},
        group_template: {},
        error: {}

        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
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
	  const group_string = seleted_ids.toString();
	  
     //action 
     fields["action"]="createFileFolders";
     fields["organizationid"]=token;
	 fields["groups"]=group_string;
    
      //organization_name
      if(!fields["file_folder_name"]){
         formIsValid = false;
         errors["file_folder_name"] = "Cannot be empty";
      }
     this.setState({errors: errors});

     return formIsValid;
    }
    
    folderSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
        this.createFolderApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleChangeName(field, e){         
      let fields = this.state.fields;
      fields[field] = e.target.value;        
      this.setState({fields});
    }
    redirectOrganization(){
      this.props.history.push('/Organization');
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
              ObjGroup: group_details
          })

           for(let i=0;i<this.state.ObjGroup.length;i++){
            options.push(
              { 
                label: this.state.ObjGroup[i].name,
                 value: this.state.ObjGroup[i].id
             }

            )
           }

           }       
     });
     
    }
    
    createFolderApi()
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
           if(status === "true")
           {
              this.props.history.push('/Attachment?organization='+ token);
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

  onChangepick=event=>{
  seleted_ids.length=0;

  
  for(let j=0;j<event.length;j++){
    seleted_ids.push(event[j].value)
   }

   console.log(seleted_ids);
   
 }
  componentDidMount() {
    this.GetOrganizationDetail();
    this.GetGroupList();
  }

  render() {
	let groupList = this.state.ObjGroup.map(v => (
    <li>
  <label class="dropdown-menu-item checkbox" for="g1360">
	<input id="file_folder_group_ids" name="file_folder_group_ids" type="checkbox" value="g1360" />
	<span class="glyphicon glyphicon-unchecked"></span>
	{v.name}
  </label>
    </li>
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
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> » <a class="" data-original-title="" title="">Supporting Files</a>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          <h2>New File Folder</h2>
  
  <form accept-charset="UTF-8"
  onSubmit= {this.folderSubmit.bind(this)}
  class="new_file_folder"
  id="new_file_folder">
<div>
	<input name="utf8" type="hidden" value="✓"/>
	<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M="/>
	</div>
  <div class="form-group">
      <label for="file_folder_name">Name</label>:
      <input class="form-control"
      placeholder="Name"
      id="file_folder_name" 
      name="file_folder_name" 
      type="text" 
      onChange={this.handleChangeName.bind(this, "file_folder_name")}
      value={this.state.fields["file_folder_name"]}
     />
    </div>
	 <h4>Access for the Groups</h4>
	 
	 
     <div class="form-group">
        <div class="btn-group" role="group" aria-label="...">
          <div class="btn-group">
            {/* <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"> Select Group Access <span class="caret"></span></button>
            <ul class="dropdown-menu">
             {groupList}   
            </ul> */}


             <ReactMultiSelectCheckboxes options={options} onChange={this.onChangepick} />
          </div>
        </div>
    </div>
  
    <hr/>
    <div class="form-group">
      <input class="btn btn-success" name="commit" type="submit" value="Save"/>&nbsp;
      <a class="btn btn-default" href="" data-original-title="" title="">Cancel</a>
    </div>
  <hr/>
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
export default AddFileFolder;