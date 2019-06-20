import React, { Component } from 'react';
import queryString from 'query-string'
import AddFileFolder from './AddFileFolder'
import AddFile from './AddFile'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';

class Attachment extends Component {
  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      attachment_template: {},
      ObjOrganizations: '',
      ObjAttachment: []
    }
    this.addFolder=this.addFolder.bind(this);
	this.addFile=this.addFile.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }

  addFolder(){
  const query = new URLSearchParams(this.props.location.search);
  const token = query.get('organization');
  this.props.history.push('/AddFileFolder?organization='+ token);
  }
  addFile(){
  const query = new URLSearchParams(this.props.location.search);
  const token = query.get('organization');
  this.props.history.push('/AddFile?organization='+ token);
  }
  redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
  editProfile(user_id,organizationid){
  this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
  }	 
  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
componentDidMount() {
  this.GetOrganizationDetail();
  this.GetAttachmentList();
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

  GetAttachmentList(){
  let attachment_template = this.state.attachment_template;
  let ObjAttachment = this.state.ObjAttachment;
  attachment_template["action"]="getAttachmentList";
  const query = new URLSearchParams(this.props.location.search);
  const organizationid = query.get('organization');
  attachment_template["organizationid"]=organizationid;
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.attachment_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const attachment_details = response.list;
       if(status === "true")
       {
        this.setState({
          ObjAttachment: attachment_details
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
    let attachmentList = this.state.ObjAttachment.map(v => (
     <tr>
          <td><strong>/{v.name}/</strong>{v.attachment}</td>
          <td className="text-right">
            <a data-method="delete" rel="nofollow" data-original-title="">Delete</a>&nbsp;
            <a data-original-title="" title="">Edit</a>
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
            <li><a className="home1" onClick={this.redirectDashboard} data-original-title="">Arodek</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
              <li className="active"><a onClick={this.redirectOrganization} data-original-title="">Admin</a></li>
              <li><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
              <li><a onClick= {this.logout} data-method="delete" rel="nofollow" data-original-title="">Log Out</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a onClick={this.redirectOrganization} data-original-title="">Admin</a> » <a class="" onClick={this.redirectOrganization} data-original-title="">Organization</a> » <a data-original-title="" title="">Supporting Files</a>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h2>
      <span className="pull-right">
          <a className="btn btn-success" onClick={this.addFolder} data-original-title="">Add Folder</a>&nbsp;
          <a className="btn btn-success" onClick={this.addFile} data-original-title="">Add File</a>
      </span>
       Supporting Files
    </h2>
    
    <table className="table table-striped">
      <tbody>
        <tr>
          <th>Folder/File Name</th>
          <th class="text-right">Actions</th>
       </tr>
       {attachmentList}
    </tbody>
	</table>
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
export default Attachment;