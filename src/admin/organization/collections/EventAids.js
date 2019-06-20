import React, { Component } from 'react';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';


class EventAids extends Component {
  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      eventaids_template: {},
	  collection_delete_template: {},
	  collection_template: {},
      ObjOrganizations: '',
      ObjEventAids: [],
	  ObjCollection: []
    }
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.redirectPlan=this.redirectPlan.bind(this);
	this.GotoaddEventAids=this.GotoaddEventAids.bind(this);
	this.editEventAids=this.editEventAids.bind(this);
	this.viewTask=this.viewTask.bind(this);
	this.supportingMaterial=this.supportingMaterial.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }
  
  GotoaddEventAids(){
  const query = new URLSearchParams(this.props.location.search);
  const organizationid = query.get('organization');
  const collectionid = query.get('collectionid');
  this.props.history.push('/AddEventAids?organization='+organizationid+'&collectionid='+collectionid);
  }
  editEventAids(chartid,organizationid,collectionid)
  {
  this.props.history.push('/EditEventAids?organization='+organizationid+'&collectionid='+collectionid+'&chartid='+chartid);
  }
  editProfile(user_id,organizationid){
     this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
     }
  viewTask(chartid,organizationid,collectionid)
  {
  this.props.history.push('/ViewTasks?chartid='+chartid+'&organization='+organizationid+'&collectionid='+collectionid);
  }
  supportingMaterial(organizationid,collectionid,chartid)
  {
  this.props.history.push('/SupportingMaterials?organization='+organizationid+'&collectionid='+collectionid+'&chartid='+chartid);
  }
  redirectOrganization(){
  this.props.history.push('/Organization');
  }
  redirectDashboard(){
  this.props.history.push('/Collection');
  }
  redirectPlan(e)
  {
	  this.props.history.push('/collections/Collections?organization='+ e);
  }

  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
componentDidMount() {
  this.GetOrganizationDetail();
  this.GetEventAidsList();
  this.GetCollectionDetails();
}

GetCollectionDetails(){
let collection_template = this.state.collection_template;
let ObjCollection = this.state.ObjCollection;
collection_template["action"]="detailCollection";
const query = new URLSearchParams(this.props.location.search);
const organizationid = query.get('organization');
const collectionid = query.get('collectionid');
collection_template["organizationid"]=organizationid;
collection_template["collectionid"]=collectionid;
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
	  const details = response.details;
	 if(status === "true")
	 {
	  this.setState({
		ObjCollection: details
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
 
 deleteEventAidsSubmit(chartid,organizationid)
{	
  if (window.confirm("Are you sure you want to delete this chart?")) {
  this.deleteEventAids(chartid,organizationid);
}
}

deleteEventAids(chartid,organizationid)
{
const query = new URLSearchParams(this.props.location.search);
const collectionid = query.get('collectionid');
let collection_delete_template = this.state.collection_delete_template;
collection_delete_template["organizationid"]=organizationid;
collection_delete_template["chartid"]=chartid;
collection_delete_template["action"]="deleteEventAids";

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
	   this.props.history.push('/EventAids?action=delete&organization='+organizationid+'&collectionid='+collectionid);
	   window.location.reload();
    }else{
		alert('something went wrong,please try again!');
	}
});
}

 GetEventAidsList(){
  let eventaids_template = this.state.eventaids_template;
  let ObjEventAids = this.state.ObjEventAids;
  eventaids_template["action"]="getEventAidsList";
  const query = new URLSearchParams(this.props.location.search);
  const organizationid = query.get('organization');
  const collectionid = query.get('collectionid');
  eventaids_template["organizationid"]=organizationid;
  eventaids_template["collectionid"]=collectionid;
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.eventaids_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const eventaids_details = response.eventaids_details;
       if(status === "true")
       {
        this.setState({
          ObjEventAids: eventaids_details
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
	const collectionid = query.get('collectionid');
	const action = query.get('action');
	let action_message
	  if(action=='delete')
	  {
		  action_message = <div data-alert="" className="alert alert-success">Collection Successfully Deleted!</div>;
	  }else if(action=='create'){
		  action_message = <div data-alert="" className="alert alert-success">Collection Successfully Addedd!</div>;
	  }else if(action=='edit'){
		  action_message = <div data-alert="" className="alert alert-success">Collection Successfully Edited!</div>;
	  }else{
	  }
    let chartList = this.state.ObjEventAids.map(v => (
      <tr>
      <td>{v.title}</td>
      <td className="text-right btnRight">
	      <a className="btn btn-sm btn-default" onClick={()=>this.supportingMaterial(organizationid,collectionid,v.id)} data-original-title="" title="">Edit Event Aid</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.viewTask(v.id,organizationid,collectionid)} data-original-title="" title="">View Tasks</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.editEventAids(v.id,organizationid,collectionid)} data-original-title="" title="">Edit</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.deleteEventAidsSubmit(v.id,organizationid)} data-method="delete" rel="nofollow" data-original-title="" title="">Delete      </a>
      </td>
    </tr>
    ));
	if (localStorage.getItem('session')) {
    return (
      <div className="bodyscroll">
      <div className="navbar navbar-inverse navbar-static-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-left">
            <li><a className="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
                <li className="active"><a onClick={this.redirectOrganization} data-original-title="">Admin</a></li>
              <li><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
              <li><a onClick= {this.logout} data-method="delete"  rel="nofollow" data-original-title="">Log Out</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a onClick={this.redirectOrganization}  data-original-title="" title="">Admin</a> » <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> » <a onClick={()=>this.redirectPlan(organizationid)} data-original-title="" title="">Plans</a> » {this.state.ObjCollection.title}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
             {action_message}
              <h2>
      <span className="pull-right">
          <a className="btn btn-success" onClick={this.GotoaddEventAids} data-original-title="" title="">Add Tab</a>
      </span>
     {this.state.ObjCollection.title}
    </h2>
    
  <table className="table table-striped">
  <tbody><tr>
    <th>Page Name</th>
    <th className="text-right">Actions</th>
  </tr>
  {chartList}
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

export default EventAids;
