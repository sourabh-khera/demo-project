import React, { Component } from 'react';
import queryString from 'query-string'
import AddGroup from './AddGroup'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';


class Groups extends Component {

  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      group_template: {},
      ObjOrganizations: '',
      ObjGroup: []
    }
    this.addGroups=this.addGroups.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectGroup=this.redirectGroup.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
 }

 addGroups(){
  const query = new URLSearchParams(this.props.location.search);
  const token = query.get('organization');
  this.props.history.push('/AddGroup?organization='+ token);
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
  this.GetGroupList();
}

redirectOrganization(){
  this.props.history.push('/Organization');
  }
  redirectToEditGroup(groupid,organizationid){
    this.props.history.push('/EditGroup?organization='+organizationid+'&group='+groupid);
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

  render() {
    const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
    let groupList = this.state.ObjGroup.map(v => (
      <tr>
          <td>{v.name}</td>
          <td class="text-right">
              <a class="btn btn-sm btn-default" onClick={()=>this.redirectToEditGroup(v.id,v.organization_id)} data-original-title="" title="">Edit</a>
          </td>
        </tr>
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
              <li><a onClick= {this.logout} data-method="delete"  rel="nofollow" data-original-title="" title="">Log Out</a></li>
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
              
    
    
              <h2>
      <span class="pull-right">
          <a class="btn btn-success" onClick={this.addGroups} data-original-title="" title="">Add Group</a>
      </span>
      {this.state.ObjOrganizations} » Groups
    </h2>
    
    <table class="table table-striped">
      <tbody><tr>
        <th>Name</th>
        <th class="text-right">Action</th>
      </tr>
    
      {groupList}
        
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

export default Groups;
