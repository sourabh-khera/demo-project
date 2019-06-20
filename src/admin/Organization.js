import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Pagination from "react-js-pagination";
import Addorganization from './organization/Addorganization'
import '../assets/css/application.css';
import  alaSQLSpace from 'alasql';

class Organization extends Component {

  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
	  organization_delete_template: {},
	  organization_count_template: {},
	  activePage: 1,
	  serach_name: '',
	  total_count: 0,
	  current_range: 30,
	  start_limit: 0,
	  start_index: 1,
	  per_page_count:0,
	  prefix_limit:0,
      ObjOrganizations: [],
	  ObjOrganization: ''
    }
    this.GotoaddOrg=this.GotoaddOrg.bind(this);
    this.handleSort=this.handleSort.bind(this);
	this.contentVariables=this.contentVariables.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.organizationSorting=this.organizationSorting.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
    this.editOrganization=this.editOrganization.bind(this);
	this.handleKeyPress = this.handleKeyPress.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }

  handlePageChange(pageNumber) {
	  let current_range;
	  let previous_number;
	  let previous_range;
	  let start_limit;
	  let start_index;
	  let per_page_number;
	  let total;
	  let new_total;
	  
	  previous_number = pageNumber - 1;
	  current_range = 30 * pageNumber;
	  previous_range = 30 * previous_number;
	  start_limit = previous_range;
	  start_index = previous_range + 1;
	  
	  if(pageNumber==1)
	  {
	  new_total = 0;
	  }else{
		  total = this.state.current_range * previous_number;
	      new_total = total + 1;
	  }
	  
	 //
	 
  let organization_template = this.state.organization_template;
  let ObjOrganizations = this.state.ObjOrganizations;
  
  let record_order;
  const query = new URLSearchParams(this.props.location.search);
  const order = query.get('order');
  const search_name = query.get('search');
  if(order=='desc')
  {
   record_order = 'DESC' ;	  
  }else{
	record_order = 'ASC' ;  
  }
  organization_template["action"]="getOrganizationList";
  organization_template["order"]=record_order;
  organization_template["search_name"]=search_name;
  organization_template["start_limit"]=new_total;
  organization_template["current_range"]=this.state.current_range;
  document.getElementById('grid_name').value = search_name;
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
		const total_count = response.total_count;
       if(status === "true")
       {
        this.setState({
          ObjOrganizations: response.template,
		  per_page_count:total_count
      })
		
       }       
 });
this.setState({
          activePage: pageNumber,
		  prefix_limit: new_total
      })
 console.log(this.state);
	 //
	 	 
	 
  }
  GotoaddOrg(){
  this.props.history.push('/Addorganization');
  }
  editProfile(user_id,organizationid)
 {
	 this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
 }
  handleSort(e){
    this.props.history.push('/groups/Groups?organization='+ e);
  }
  handleUser(e){
    this.props.history.push('/users/User?organization='+ e);
  }
  handlePlans(e){
    this.props.history.push('/collections/Collections?organization='+ e);
  }
  editOrganization(e)
  {
    this.props.history.push('/Edit?organization='+ e);
  }
  contentVariables(e)
  {
	  this.props.history.push('/Variables?organization='+ e);
  }
  supportingFiles(e)
  {
	  this.props.history.push('/Attachment?organization='+ e);
  }

	redirectOrganization(){
	let search_name = document.getElementById('grid_name').value;	
	this.props.history.push('/Organization?search='+search_name);
	window.location.reload();
	}
	organizationSorting(){
		let search_name = document.getElementById('grid_name').value;
		this.props.history.push('/Organization?order=desc&search='+search_name);
		window.location.reload();
	}
	redirectDashboard(){
		this.props.history.push('/Collection');
	}
	
deleteOrganizationSubmit(organizationid)
{
  if (window.confirm("Are you sure you want to delete this organization")) {
  this.deleteOrganization(organizationid);
}
	  
	  
}

deleteOrganization(organizationid)
{ 
let organization_delete_template = this.state.organization_delete_template;
organization_delete_template["organizationid"]=organizationid;
organization_delete_template["action"]="deleteOrganization";

fetch(global.api_url,
  {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.organization_delete_template)
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


logout() {
	if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
}
}

handleKeyPress = (event) => {
  if(event.key == 'Enter'){
	const search_name = event.target.value;
    this.props.history.push('/Organization?search='+search_name);
	window.location.reload();
  }
}

componentDidMount() {
  this.getOrganizationCount();	
  this.GetOrganizationList();
  this.getOrganizationName();
}

getOrganizationName()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }

GetOrganizationList(){
  let organization_template = this.state.organization_template;
  let ObjOrganizations = this.state.ObjOrganizations;
  let start_limit = this.state.start_limit;
  let current_range = this.state.current_range;
  /*alert(start_limit+'-'+current_range)*/
  
  let record_order;
  const query = new URLSearchParams(this.props.location.search);
  const order = query.get('order');
  const search_name = query.get('search');
  if(order=='desc')
  {
   record_order = 'DESC' ;	  
  }else{
	record_order = 'ASC' ;  
  }
  organization_template["action"]="getOrganizationList";
  organization_template["order"]=record_order;
  organization_template["search_name"]=search_name;
  organization_template["start_limit"]=start_limit;
  organization_template["current_range"]=current_range;
  document.getElementById('grid_name').value = search_name;
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
		const total_count=response.total_count;
        const template = response.template;
       if(status === "true")
       {
        this.setState({
          ObjOrganizations: response.template,
		  per_page_count:total_count
      })
		
       }       
 });
 console.log(this.state);
}
getOrganizationCount()
{
	const query = new URLSearchParams(this.props.location.search);
    const search_name = query.get('search');
	let organization_count_template = this.state.organization_count_template;
	organization_count_template["action"]="getOrganizationTotalCount";
	organization_count_template["search_name"]=search_name;
	fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.organization_count_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
		const total_count=response.total_count;
       if(status === "true")
       {
        this.setState({
		  total_count: total_count
      })
		
       }       
 });
}

      render() {
	  const start_index = this.state.prefix_limit;
	  const per_page_count = this.state.per_page_count;
	  const per_page_total = start_index + per_page_count;
	  
	  let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	  
      const query = new URLSearchParams(this.props.location.search);
      const success = query.get('success');
	  let sucess_message
	  let record_sort
	  if(success=='true')
	  {
		  sucess_message = <div data-alert="" className="alert alert-success">Organization successfully created!</div>;
	  }else{
		  sucess_message = '';
	  }
	  
	  const order = query.get('order');
	  if(order=='desc')
	  {
	   record_sort = <a className="asc" onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> ;	  
	  }else{
		record_sort = <a className="asc" onClick={this.organizationSorting} data-original-title="" title="">Organization</a> ; 
	  }
	  
	  
      let organizationList = this.state.ObjOrganizations.map(v => (
      <tr>
        <td className="sorted">{v.name}</td>
        <td>
        <div className={"label " + v.class}>{v.active}</div>   
        </td>
        <td className="text-right">
          <a className="btn btn-sm btn-default" onClick={()=>this.handlePlans(v.id)}  data-original-title="" title="">Plans</a>
          <a className="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.supportingFiles(v.id)}>Supporting Files</a>
          <a className="btn btn-sm btn-default" data-original-title="" title="">Incident Logs</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.handleSort(v.id)} data-original-title="" title="">Groups</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.handleUser(v.id)} data-original-title="" title="">Users ({v.user_count})</a>
          <a className="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.contentVariables(v.id)}>Content Variables</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.editOrganization(v.id)} data-original-title="" title="">Edit</a>
          <a className="btn btn-sm btn-default" onClick={()=>this.deleteOrganizationSubmit(v.id)} data-method="DELETE" rel="nofollow" data-original-title="" title="">Delete</a>
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
        <li><a className="home1" onClick={this.redirectDashboard} data-original-title="" title="">{this.state.ObjOrganization}</a></li>
      </ul>
      <ul className="nav navbar-nav navbar-right">
            <li className="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
          <li className=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
          <li><a onClick= {this.logout}>Log Out</a></li>
      </ul>
    </div>
  </div>
</div>

    <div className="container">
      <div className="row">
        <div className="col-xs-12">
        <a className="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Organizations
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
		 {sucess_message}
          <h2 className="">
    <span className="pull-right">
      {sdata.super_admin!=0?<a className="btn btn-success" onClick={this.GotoaddOrg} data-original-title="" title="">Add Organization</a>:''}
    </span>
    Organizations
</h2>

<div className="wice-grid-container table-responsive" data-grid-name="grid" id="grid"><div id="grid_title"></div>
<table className="table-striped table-bordered table wice-grid table table-striped">
  <thead>
    <tr className="wice-grid-title-row">
      <th className=" sorted">{record_sort}</th>
      <th className="">Status</th>
      <th className="text-right text-right"></th>
    </tr>
    <tr className="wg-filter-row" id="grid_filter_row">
      <th className="sorted sorted">
	  <input className="form-control input-sm"
	  id="grid_name"
	  name="grid_name"
	  size="8"
	  type="text"
	  onKeyPress={this.handleKeyPress} />
	  </th>
      <th className=""></th><th className="text-right text-right filter_icons"><div className="submit clickable" id="grid_submit_grid_icon" title="Filter"></div> <div className="reset clickable" id="grid_reset_grid_icon" title="Reset"></div>
      </th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td colSpan="3">
	  <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={30}
          totalItemsCount={this.state.total_count}
          pageRangeDisplayed={5}
		  onChange={this.handlePageChange.bind(this)}
        />
      </div>
  
</td>
</tr>
</tfoot>
<tbody>
   {organizationList}

</tbody>
</table>
<div className="wg-data">
<div className="pagination_status">{this.state.prefix_limit} - {per_page_total} / <span id="end_index"></span> {this.state.total_count} <a className="wg-show-all-link" href="#" title="" data-original-title="Show all records">show all</a></div>
</div>
</div>

        </div>
      </div>
   
	<div className="modal fade" id="siteModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h4 className="modal-title" id="myModalLabel">Programs Library</h4>
				</div>
				<div className="modal-body">
					...
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
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

export default Organization;
