import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'


class AddGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
        group_name: '',
        group_view_files: 'false',
        group_view_ecs: 'false',
        template_id: '',
        ObjOrganizations: [],
        ObjCollections: [],
		items: [],
        fields: {},
        organization_template: {},
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
	  const resource_string = this.state.items.toString();
     //action 
     fields["action"]="createGroups";
     fields["organization_id"]=token;
	 fields["resources"]=resource_string;
    
      //organization_name
      if(!fields["group_name"]){
         formIsValid = false;
         errors["group_name"] = "Cannot be empty";
      }
     this.setState({errors: errors});

     return formIsValid;
    }
    
    groupSubmit(e){
      e.preventDefault();
    
      if(this.handleValidation()){
        this.createGroupApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleChangeViewFile(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleChangeViewECS(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
	
	handleChangeResource(field, e){         
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
    redirectOrganization(){
      this.props.history.push('/Organization');
      }
	redirectGroup()
	  {
		  const query = new URLSearchParams(this.props.location.search);
          const organizationid = query.get('organization');
		  this.props.history.push('/groups/Groups?organization='+ organizationid);
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
      collection_template["action"]="getCollectionList";
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
      collection_template["organizationid"]=organizationid;
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
    
    createGroupApi()
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
  }
   onToggle(e) {
    // current array of options
    const options = this.state.items
    let index
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      options.push(+e.target.value)
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = options.indexOf(+e.target.value)
      options.splice(index, 1)
    }
    // sort the array
    options.sort()   
    // update the state with the new array of options
    this.setState({ items: options })
	/*console.log(this.state.items);*/
  }

  render() {
    let collectionList = this.state.ObjCollections.map(v => (
        <div>
          <input id="{v.id}"
           name="group_collection_id"
           type="checkbox"
           value={v.id}
           class="group_collection"
		   onChange={this.onToggle.bind(this)}
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
            <li class=""><a data-original-title="" title="">Edit Profile</a></li>
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
          <h2>{this.state.ObjOrganizations} » New Group</h2>
  
  <form accept-charset="UTF-8"
  onSubmit= {this.groupSubmit.bind(this)}
  class="new_group"
  id="new_group">

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
     value={this.state.fields["group_name"]}
     />
    </div>
    <hr/>
    <div class="form-group">
    <input 
    onChange={this.handleChangeViewFile.bind(this,'group_view_files')}
    type="checkbox"
    value={this.state.fields["group_view_files"]}
    id="group_view_files" 
    name="group_view_files" />
      <label for="group_view_files">&nbsp;Can View Files?</label>:
    </div>
    
    <div class="form-group">
    <input 
    onChange={this.handleChangeViewECS.bind(this,'group_view_ecs')}
    type="checkbox"
    value={this.state.fields["group_view_ecs"]}
    id="group_view_ecs" 
    name="group_view_ecs" />
      <label for="group_view_ecs">&nbsp;Can View ECS?</label>
    </div>
  <hr/>
  <h4>Available Resources</h4>
    {collectionList}
  
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

export default AddGroup;
