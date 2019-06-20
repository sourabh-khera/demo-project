import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class AddCollections extends Component {
    constructor(props){
        super(props);
        this.state = {
        collection_title:'',
        collection_active: 'false',
        collection_locked: 'false',  
        ObjOrganizations: [],
        fields: {},
        organization_template: {},
        error: {}

        }
		this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
		this.editProfile=this.editProfile.bind(this);
     }
	 redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
     editProfile(user_id,organizationid){
     this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
     }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  let userid = session_array.id;
     //action 
     fields["action"]="createCollection";
     fields["organization_id"]=token;
	 fields["userid"]=userid;
    
      //organization_name
      if(!fields["collection_title"]){
         formIsValid = false;
         errors["collection_title"] = "Cannot be empty";
      }
     this.setState({errors: errors});

     return formIsValid;
    }
    
    collectionSubmit(e){
      e.preventDefault();
    
      if(this.handleValidation()){
        this.createCollectionApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleChangeLocked(field, e){         
      let fields = this.state.fields;
      let isChecked = e.target.checked;
      fields[field] = isChecked;     
      this.setState({fields});
    }
    handleChangeActive(field, e){         
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
    
    createCollectionApi()
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
              this.props.history.push('/collections/Collections?organization='+ token);
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
  }

  render() {
	 let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id; 
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
            <li class=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
            <li><a data-confirm="Are you sure you want to log out?" onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
          <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Plan
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          <h2>{this.state.ObjOrganizations} » New Plan</h2>
  
  <form accept-charset="UTF-8"
  onSubmit= {this.collectionSubmit.bind(this)}
  class="new_collection"
  id="new_collection">

<div>
	<input name="utf8" type="hidden" value="✓"/>
	<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M="/>
	</div>
   
  <div class="form-group">
  <label for="collection_title">Title</label>:
  <input class="form-control"
    placeholder="Title"
     id="collection_title" 
     name="collection_title" 
     type="text"
     onChange={this.handleChangeName.bind(this, "collection_title")}
     value={this.state.fields["collection_title"]} 
     />
    </div>
  
    <div class="form-group">
    <input
    type="checkbox"
    id="collection_active" 
    name="collection_active"
    onChange={this.handleChangeActive.bind(this,'collection_active')}
    value={this.state.fields["collection_active"]} />
      <label for="collection_active">&nbsp;Active</label>:
    </div>
    
    <div class="form-group">
    <input
    type="checkbox"
    id="collection_locked" 
    name="collection_locked"
    onChange={this.handleChangeLocked.bind(this,'collection_locked')}
    value={this.state.fields["collection_locked"]} />
      <label for="collection_locked">&nbsp;Locked</label>
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

export default AddCollections;
