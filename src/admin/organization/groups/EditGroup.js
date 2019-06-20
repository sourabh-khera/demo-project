import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class EditGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
        group_name: '',
        group_view_files: 'false',
        group_view_ecs: 'false',
        template_id: '',
        ObjGroup: [],
        ObjCollections: [],
        fields: {},
		items: [],
        organization_template: {},
        group_template: {},
        collection_template: {},
        error: {}

        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectGroup=this.redirectGroup.bind(this);
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
      const groupid = query.get('group');
	  const resource_array = this.state.ObjCollections;
	  const collection_array = [];
	  
	  for (let i=0;i<resource_array.length;i++){
        if(resource_array[i].checked ===true){
            collection_array.push(resource_array[i].id);
        }
	  }
	  const resource_string = collection_array.toString();	  
     //action 
     fields["action"]="editGroup";
     fields["organizationid"]=token;
     fields["groupid"]=groupid;
	 fields["resources"]=resource_string;

     let group_name = document.getElementById('group_name').value;
     let group_view_files_isChecked = document.getElementById('group_view_files').checked;
     let group_view_ecs_isChecked = document.getElementById('group_view_ecs').checked;
     fields["group_view_files"] = group_view_files_isChecked;
     fields["group_view_ecs"] = group_view_ecs_isChecked;

     //group_name
     if(group_name==''){
      formIsValid = false;
      errors["group_name"] = "Cannot be empty";
   }else{
     fields["group_name"]=group_name;
   }

     this.setState({errors: errors});

     return formIsValid;
    }
    
    groupSubmit(e){
      e.preventDefault();
    if(this.handleValidation()){
        this.editGroupApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    

    handleChangeViewFile(field, e){     
      let fields = this.state.fields;
      let isChecked = e.target.checked;

      if(isChecked==true)
      {
        document.getElementById('group_view_files').value = '1';
      }else
      {
        document.getElementById('group_view_files').value = '0';
      }
    }
    /*handleChangeViewECS(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }*/

    handleChangeViewECS(field, e){     
      let fields = this.state.fields;
      let isChecked = e.target.checked;

      if(isChecked==true)
      {
        document.getElementById('group_view_ecs').value = '1';
      }else
      {
        document.getElementById('group_view_ecs').value = '0';
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
	  redirectGroup()
	  {
		  const query = new URLSearchParams(this.props.location.search);
          const organizationid = query.get('organization');
		  this.props.history.push('/groups/Groups?organization='+ organizationid);
	  }
        GetGroupDetails(){
        let group_template = this.state.group_template;
        let ObjGroup = this.state.ObjGroup;
        group_template["action"]="detailGroup";
        const query = new URLSearchParams(this.props.location.search);
        const organizationid = query.get('organization');
        const groupid = query.get('group');
        group_template["organizationid"]=organizationid;
        group_template["groupid"]=groupid;  
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
              const details = response.details;
             if(status === "true")
             {
              this.setState({
                ObjGroup: response.details
            })
             }       
       });
       
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

    GetCollectionList(){
      let collection_template = this.state.collection_template;
      let ObjCollections = this.state.ObjCollections;
      collection_template["action"]="getCollectionListEdit";
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  const groupid = query.get('group');
      collection_template["organizationid"]=organizationid;
	  collection_template["groupid"]=groupid;
      fetch(global.api_url,
         {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(this.state.collection_template)
         })
          .then((response) => response.json())
          .then((response) => { 
            const status=response.status;
            const collection_details = response.collection_details;
           if(status === "true")
           {
            this.setState({
              ObjCollections: response.collection_details
          })
           }       
     });
     
    }
    editGroupApi()
    {
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
      const groupid = query.get('group');
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
            this.props.history.push('/groups/Groups?organization='+ token);
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
    this.GetOrganizationDetail();
    this.GetCollectionList();
    this.GetGroupDetails();
  }
  
  
  onToggle(index, e){
  	let newItems = this.state.ObjCollections.slice();
		newItems[index].checked = !newItems[index].checked
  	this.setState({
    	ObjCollections: newItems
    })
  }

  render() {
    //console.log(this.state.ObjGroup);
    let group_view_files_checkbox;
    let group_view_ecs_checkbox;
    let group_view_files_checkbox_val = this.state.ObjGroup.view_files;
    let group_view_ecs_checkbox_val = this.state.ObjGroup.view_ecs;
    if(group_view_files_checkbox_val == 1){
      group_view_files_checkbox = (
  <input
  type="checkbox"
  defaultChecked="true"
  id="group_view_files"
  name="group_view_files" />
       );
    }else if(group_view_files_checkbox_val == 0){
      group_view_files_checkbox = (
        <input
        type="checkbox"
        id="group_view_files"
        name="group_view_files" />
             );
    }else{
  
    }
  
    if(group_view_ecs_checkbox_val == 1){
    group_view_ecs_checkbox = (
  <input
   id="group_view_ecs" 
   name="group_view_ecs" 
   type="checkbox"
   defaultChecked="true" />
      );
   }else if(group_view_ecs_checkbox_val == 0){
    group_view_ecs_checkbox = (
       <input
   id="group_view_ecs" 
   name="group_view_ecs" 
   type="checkbox"/>
     );
   }else{
  
   } 

    let collectionList = this.state.ObjCollections.map(v => (
        <div>
          <input id="{v.id}"
           name="group_collection_id"
           type="checkbox"
           value={v.id}
           class="group_collection"
		   checked={v.checked_status}
           />
          <label for="{v.id}">&nbsp;{v.title}</label>
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
          <li><a class="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
              <li class="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li class=""><a  data-original-title="" title="">Edit Profile</a></li>
            <li><a data-confirm="Are you sure you want to log out?" onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » <a class="" onClick={this.redirectGroup} data-original-title="" title="">Groups</a>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          <h2>{this.state.ObjOrganizations} » Edit Group</h2>
  
  <form accept-charset="UTF-8"
  onSubmit= {this.groupSubmit.bind(this)}
  class="edit_group"
  id="edit_group">

<div>
	<input name="utf8" type="hidden" value="✓"/>
	<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M="/>
	</div> 
  <div class="form-group">
  <label for="group_name">Name</label>:
  <input class="form-control"
  placeholder="Group Name"
  id="group_name" 
     name="group_name" 
     type="text" 
     onChange={this.handleChangeName.bind(this, "group_name")}
     defaultValue ={this.state.ObjGroup.name}
     />
    </div>
    <hr/>
    <div class="form-group">
     {group_view_files_checkbox}
      <label for="group_view_files">&nbsp;Can View Files?</label>:
    </div>
    
    <div class="form-group">
    {group_view_ecs_checkbox}
      <label for="group_view_ecs">&nbsp;Can View ECS?</label>
    </div>
  <hr/>
  <h4>Available Resources</h4>
  {this.state.ObjCollections.map((item, i) =>
  <div key={i}>
  <input id={item.id}
   name="group_collection_id"
   type="checkbox"
   value={item.id}
   checked={item.checked}
   class="group_collection"
   onChange={this.onToggle.bind(this, i)}
   />
  <label for={item.id}>&nbsp;{item.title}</label>
  </div>
   )}
  
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

export default EditGroup;
