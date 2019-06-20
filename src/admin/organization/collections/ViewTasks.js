import React, { Component } from 'react';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import alasql from 'alasql';
class ViewTasks extends Component {
  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      viewtask_template: {},
	  collection_template: {},
      ObjOrganizations: '',
      ObjViewTasks: [],
	  ObjCharts: [],
	  ObjCollection : []
    }
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.redirectEventAids=this.redirectEventAids.bind(this);
	this.redirectPlan=this.redirectPlan.bind(this);
	this.redirectEditTasks=this.redirectEditTasks.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }

  redirectOrganization(){
  this.props.history.push('/Organization');
  }
  editProfile(user_id,organizationid)
  {
  this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
  }
  redirectDashboard(){
  this.props.history.push('/Collection');
  }
  redirectEditTasks(card_id,chart_id,organizationid,collectionid)
  {
	  this.props.history.push('/EditTasks?organization='+organizationid+'&collectionid='+collectionid+'&card_id='+card_id+'&chartid='+chart_id);
  }
  redirectPlan(e){
  this.props.history.push('/collections/Collections?organization='+ e);
  }
  
  redirectEventAids(organizationid,collectionid)
  {
	this.props.history.push('/EventAids?organization='+organizationid+'&collectionid='+collectionid);
  }
  
  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
componentWillMount(){
this.getChartList();
}  
componentDidMount() {
  this.GetOrganizationDetail();
  this.GetCollectionDetails();
  this.GetViewTaskList();
}

getChartList(){
const query = new URLSearchParams(this.props.location.search);
const chartid = query.get('chartid');
let safeguard= localStorage.getItem("safeguard");
let safeguarddata=JSON.parse(safeguard);
let charts=safeguarddata.charts;
let res= alasql('SELECT * FROM ? where id = ?', [charts,chartid]);
this.setState({
ObjCharts:res
})
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
       }else{
	   }
 });
 }
 
  GetViewTaskList(){
  let viewtask_template = this.state.viewtask_template;
  let ObjViewTasks = this.state.ObjViewTasks;
  viewtask_template["action"]="getViewTaskList";
  const query = new URLSearchParams(this.props.location.search);
  const organizationid = query.get('organization');
  const chartid = query.get('chartid');
  viewtask_template["organizationid"]=organizationid;
  viewtask_template["chartid"]=chartid;
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.viewtask_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const task_list = response.task_list;
         if(status === "true")
       {
        this.setState({
          ObjViewTasks: task_list
      })
       }else{
	   }
 });
 
}
  render() {
	
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization'); 
	const collectionid = query.get('collectionid');
	console.log(this.state.ObjCharts);
	
	let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	
	let supporting_material_title = this.state.ObjCharts.map(v => (
	  v.supporting_materials_title
    ));
	
	let title = this.state.ObjCharts.map(v => (
	  v.title
    ));
	
	if (localStorage.getItem('session')) {
	let taskList = this.state.ObjViewTasks.map(v => (
      <tr id={v.id}>
          <td>
            <div className={'card-type ' + v.card_type_lower}>{v.card_type}</div>
          </td>
          <td>{ ReactHtmlParser(v.content) }</td>
          <td className="text-right">
            <a className="btn btn-sm btn-default" data-original-title="" onClick={()=>this.redirectEditTasks(v.id,v.chart_id,organizationid,collectionid)}>Edit Task</a>
          </td>
        </tr>
    ));	
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
                <li><a className="home" data-original-title="" title="">Arodek</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                    <li className="active"><a data-original-title="" title="">Admin</a></li>
                  <li className=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
               <li><a data-method="delete" rel="nofollow" data-original-title="" title="Log Out">Log Out</a></li>
              </ul>
            </div>
          </div>
        </div>
	
	<div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a data-original-title="" onClick={this.redirectOrganization}>Admin</a> » <a data-original-title="" onClick={()=>this.redirectPlan(organizationid)}>Plans</a> » <a data-original-title="" onClick={()=>this.redirectEventAids(organizationid,collectionid)}>{this.state.ObjCollection.title}</a> » {title}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h1>{title}</h1>
              <h2 className="">Tasks</h2>
    <table className="table table-striped card-list">
      <tbody><tr>
        <th>Type</th>
        <th>Snippet</th>
        <th className="text-right">Actions</th>
      </tr>
	  {taskList}
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

export default ViewTasks;