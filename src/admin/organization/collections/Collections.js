import React, { Component } from 'react';
import queryString from 'query-string'
import AddCollections from './AddCollections'
import EditCollections from './EditCollections'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';


class Collections extends Component {

  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      collection_template: {},
	  collection_delete_template: {},
      ObjOrganizations: '',
      ObjCollections: []
    }
    this.addCollections=this.addCollections.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }

  addCollections(){
  const query = new URLSearchParams(this.props.location.search);
  const token = query.get('organization');
  this.props.history.push('/AddCollections?organization='+ token);
  }
  editProfile(user_id,organizationid){
  this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
  }
  redirectOrganization(){
  this.props.history.push('/Organization');
  }
  redirectToEditCollections(collectionid,organizationid){
    this.props.history.push('/EditCollections?organization='+organizationid+'&plan='+collectionid);
  }
  redirectToEventAids(collectionid,organizationid)
  {
	  this.props.history.push('/EventAids?organization='+organizationid+'&collectionid='+collectionid);
  }
  redirectToEventIntroduction(collectionid,organizationid)
  {
	  this.props.history.push('/CollectionSupportingMaterials?organization='+organizationid+'&collectionid='+collectionid);
  }
  
  redirectDashboard(){
  this.props.history.push('/Collection');
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
 
 deleteCollectionSubmit(collectionid,organizationid)
{
  if (window.confirm("Are you sure you want to delete this plan")) {
  this.deletePlan(collectionid,organizationid);
}
}

deletePlan(collectionid,organizationid)
{
const query = new URLSearchParams(this.props.location.search);
const token = query.get('organization');  
let collection_delete_template = this.state.collection_delete_template;
collection_delete_template["organizationid"]=organizationid;
collection_delete_template["collectionid"]=collectionid;
collection_delete_template["action"]="deleteCollection";

fetch(global.api_url,
  {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.collection_delete_template)
  })
   .then((response) => response.json())
   .then((response) => { 
     const status=response.status;
    if(status === "true")
    {
	   this.props.history.push('/collections/Collections?action=delete&organization='+ token);
	   window.location.reload();
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
      render() {
	  let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	  
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
	const action = query.get('action');
	let action_message
	  if(action=='delete')
	  {
		  action_message = <div data-alert="" className="alert alert-success">Collection Successfully Deleted!</div>;
	  }else{
		  action_message = '';
	  }
    let collectionList = this.state.ObjCollections.map(v => (
      <tr>
      <td>{v.title}</td>
      <td className="text-right btnRight">
          <a className="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.redirectToEventAids(v.id,organizationid)}>Event Aids</a>
          <a className="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.redirectToEventIntroduction(v.id,organizationid)}>Edit Event Introduction</a>
          <a className="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.redirectToEditCollections(v.id,v.organization_id)}>Edit</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.deleteCollectionSubmit(v.id,v.organization_id)} data-method="delete" rel="nofollow" data-original-title="" title="">Delete</a>
      </td>
    </tr>
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
                <li className="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
              <li className=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
              <li><a onClick= {this.logout} data-method="delete"  rel="nofollow" data-original-title="" title="">Log Out</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a className="" onClick={this.redirectOrganization}  data-original-title="">Admin</a> » <a onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> » Plans
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              {action_message}
              <h2>
      <span className="pull-right">
          <a className="btn btn-success" onClick={this.addCollections} data-original-title="">Add Plan</a>
      </span>
      Plans
    </h2>
    
  <table className="table table-striped">
  <tbody><tr>
    <th>Plan Name</th>
    <th className="text-right">Actions</th>
  </tr>
  {collectionList}
</tbody></table>
    
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

export default Collections;
