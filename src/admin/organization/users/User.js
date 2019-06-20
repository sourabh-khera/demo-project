import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import queryString from 'query-string'
import AddGroup from './AddUser'
import Pagination from "react-js-pagination";



class User extends Component {

  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
	  user_count_template: {},
      user_template: {},
      user_delete_template: {},
      ObjOrganizations: '',
	  ObjOrganization: '',
	  activePage: 1,
	  serach_name: '',
	  total_count: 0,
	  current_range: 30,
	  start_limit: 0,
	  start_index: 1,
	  per_page_count:0,
	  prefix_limit:0,
      ObjUser: []
    }
    this.handleAddUser=this.handleAddUser.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.editProfile=this.editProfile.bind(this);
 }

 
 redirectDashboard(){
 this.props.history.push('/Collection');
 }
 
 editProfile(user_id,organizationid)
 {
	 this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
 }
 
 handleAddUser(){
  const query = new URLSearchParams(this.props.location.search);
  const token = query.get('organization');
  this.props.history.push('/AddUser?organization='+ token);
  }
handlePageChange(pageNumber) {
	  let current_range;
	  let previous_number;
	  let previous_range;
	  let start_limit;
	  let start_index;
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
	  
	  let user_template = this.state.user_template;
	  let ObjUser = this.state.ObjUser;
	  user_template["action"]="getUserList";
	  const query = new URLSearchParams(this.props.location.search);
	  const organizationid = query.get('organization');
	  user_template["organizationid"]=organizationid;
	  user_template["start_limit"]=new_total;
      user_template["current_range"]=this.state.current_range;
	  
	  user_template["first_name"]=query.get('first_name');
	  user_template["last_name"]=query.get('last_name');
	  user_template["email"]=query.get('email');
	  user_template["school"]=query.get('school');
	  user_template["group"]=query.get('group');
	  user_template["status"]=query.get('status');
	  
	  
	  fetch(global.api_url,
		 {
			 method: 'POST',
			 headers: {
				 Accept: 'application/json',
				 'Content-Type': 'application/json'
			 },
			 body: JSON.stringify(this.state.user_template)
		 })
		  .then((response) => response.json())
		  .then((response) => { 
			const status=response.status;
			const user_list = response.user_list;
			const total_count = response.total_count;
		   if(status === "true")
		   {
			this.setState({
			  ObjUser: response.user_list,
			  per_page_count:total_count
		  })
		   }       
	 });
	this.setState({
          activePage: pageNumber,
		  prefix_limit: new_total
      })	  
}

  getOrganizationName()
  {
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  this.setState({
          ObjOrganization: session_array.organization
      })
  }  

  GetUserList(){	
  let user_template = this.state.user_template;
  let ObjUser = this.state.ObjUser;
  user_template["action"]="getUserList";
  const query = new URLSearchParams(this.props.location.search);
  const organizationid = query.get('organization');
  user_template["organizationid"]=organizationid;
  user_template["start_limit"]=this.state.start_limit;
  user_template["current_range"]=this.state.current_range;
  
  user_template["first_name"]=query.get('first_name');
  user_template["last_name"]=query.get('last_name');
  user_template["email"]=query.get('email');
  user_template["school"]=query.get('school');
  user_template["group"]=query.get('group');
  user_template["status"]=query.get('status');
  
  document.getElementById('grid_first_name').value = query.get('first_name');
  document.getElementById('grid_last_name').value = query.get('last_name');
  document.getElementById('grid_email').value = query.get('email');
  document.getElementById('grid_school').value = query.get('school');
  document.getElementById('grid_groups_name').value = query.get('group');
  if(query.get('status')!=undefined)
  {
	  document.getElementById('grid_active').value = query.get('status');
  }else{
	  document.getElementById('grid_active').value = 'Active';
  }
  
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.user_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const user_list = response.user_list;
		const total_count = response.total_count;
       if(status === "true")
       {
        this.setState({
          ObjUser: response.user_list,
		  per_page_count: total_count
      })
       }       
 });
 
}
  
getUserCount()
{
	let user_count_template = this.state.user_count_template;
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
	user_count_template["action"]="getUserTotalCount";
	user_count_template["organizationid"]=organizationid;
	
	  user_count_template["first_name"]=query.get('first_name');
	  user_count_template["last_name"]=query.get('last_name');
	  user_count_template["email"]=query.get('email');
	  user_count_template["school"]=query.get('school');
	  user_count_template["group"]=query.get('group');
	  user_count_template["status"]=this.menu.value;
	
	fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.user_count_template)
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

  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
handleFirstNameKeyPress = (event) => {
  if(event.key == 'Enter'){
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_first_name = event.target.value;
	const search_last_name = document.getElementById('grid_last_name').value;
	const search_email = document.getElementById('grid_email').value;
	const search_school = document.getElementById('grid_school').value;
	const search_group = document.getElementById('grid_groups_name').value;
	let search_status = this.menu.value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  }
}

handleLastNameKeyPress = (event) => {
  if(event.key == 'Enter'){
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_last_name = event.target.value;
	const search_first_name = document.getElementById('grid_first_name').value;
	const search_email = document.getElementById('grid_email').value;
	const search_school = document.getElementById('grid_school').value;
	const search_group = document.getElementById('grid_groups_name').value;
	let search_status = this.menu.value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  }
}

handleEmailKeyPress = (event) => {
  if(event.key == 'Enter'){
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_email = event.target.value;
	const search_first_name = document.getElementById('grid_first_name').value;
	const search_last_name = document.getElementById('grid_last_name').value;
	const search_school = document.getElementById('grid_school').value;
	const search_group = document.getElementById('grid_groups_name').value;
	let search_status = this.menu.value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  }
}

handleSchoolKeyPress = (event) => {
  if(event.key == 'Enter'){
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_school = event.target.value;
	const search_first_name = document.getElementById('grid_first_name').value;
	const search_last_name = document.getElementById('grid_last_name').value;
	const search_email = document.getElementById('grid_email').value;
	const search_group = document.getElementById('grid_groups_name').value;
	let search_status = this.menu.value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  }
}

handleGroupKeyPress = (event) => {
  if(event.key == 'Enter'){
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_group = event.target.value;
	const search_first_name = document.getElementById('grid_first_name').value;
	const search_last_name = document.getElementById('grid_last_name').value;
	const search_email = document.getElementById('grid_email').value;
	const search_school = document.getElementById('grid_school').value;
	let search_status = this.menu.value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  }
}

handleStatusKeyPress = (event) => {
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
	const search_status = event.target.value;
	const search_first_name = document.getElementById('grid_first_name').value;
	const search_last_name = document.getElementById('grid_last_name').value;
	const search_email = document.getElementById('grid_email').value;
	const search_school = document.getElementById('grid_school').value;
	const search_group = document.getElementById('grid_groups_name').value;
	this.props.history.push('/users/User?organization='+organizationid+'&first_name='+search_first_name+'&last_name='+search_last_name+'&email='+search_email+'&school='+search_school+'&group='+search_group+'&status='+search_status+'');
	window.location.reload();	
  
}
componentDidMount() {
this.GetOrganizationDetail();
this.GetUserList();
this.getUserCount();
this.getOrganizationName();
}

editUser(userid,organizationid){
this.props.history.push('/EditUser?organization='+organizationid+'&user='+userid);
}

deleteUserSubmit(userid,organizationid)
{
  if (window.confirm("Are you sure you want to delete this user")) {
  this.deleteUser(userid,organizationid);
}
}

deleteUser(userid,organizationid)
{
const query = new URLSearchParams(this.props.location.search);
const token = query.get('organization');  
let user_delete_template = this.state.user_delete_template;
user_delete_template["organizationid"]=organizationid;
user_delete_template["userid"]=userid;
user_delete_template["action"]="deleteUser";

fetch(global.api_url,
  {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.user_delete_template)
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



redirectOrganization(){
  this.props.history.push('/Organization');
  }

GetGroupDetails(){
  let group_template = this.state.group_template;
  let ObjGroup = this.state.ObjGroup;
  group_template["action"]="getGroupDetails";
  const groupid = 10;
  group_template["groupid"]=groupid;
  fetch(global.api_url,
     {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(this.state.user_template)
     })
      .then((response) => response.json())
      .then((response) => { 
        const status=response.status;
        const user_list = response.user_list;
       if(status === "true")
       {
        this.setState({
          ObjUser: response.user_list
      })
       }       
 });
 
}

render() { 
const query = new URLSearchParams(this.props.location.search);
const organizationid = query.get('organization');
const action = query.get('action');
let token = localStorage.getItem("session");
let token_array=JSON.parse(token);
let user_id = token_array.id;
let organization_id = token_array.organization_id;

let action_message
if(action=='created')
	  {
	  action_message = <div data-alert="" className="alert alert-success">User successfully created!</div>;
	  }else{
		  action_message = '';
	  }
const start_index = this.state.prefix_limit;
const per_page_count = this.state.per_page_count;
const per_page_total = start_index + per_page_count;
let userList = this.state.ObjUser.map(v => (
<tr className="odd" key={v.id}>
<td>{v.first_name}</td>
<td>{v.last_name}</td>
<td className="sorted">{v.email}</td>
<td>{v.school}</td>
<td><div className={"label " + v.active_class}>{v.active_text}</div></td>
<td>{v.group_name}</td>
<td className="text-right">
{v.super_admin!=0?<div className={v.super_admin_class}>{v.super_admin_text}</div>:''}<br/>
{v.organization_admin!=0?<div className={v.organization_admin_class}>{v.organization_admin_text}</div>:''}<br/> 
{v.admin!=0?<div className={v.admin_class}>{v.admin_text}</div>:''} 
<br/><div className="label label-default">{v.group_name}</div>
</td>
<td><a className="btn btn-sm btn-default" onClick={()=>this.editUser(v.id,organizationid)} data-original-title="" title="">Edit</a></td>
<td>{v.super_admin!=1?<a className="btn btn-sm btn-default" onClick={()=>this.deleteUserSubmit(v.id,organizationid)} data-original-title="" title="">Delete</a>:''}</td>
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
              <li><a data-method="delete" onClick= {this.logout}  rel="nofollow" data-original-title="" title="">Log Out</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="container">
    <div className="row">
            <div className="col-xs-12">
            <a className="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Users
            </div>
          </div> 
          <div className="row">
          <div className="col-xs-12">
         {action_message}
          <h2>
          <span className="pull-right">
          <a className="btn btn-success" onClick={this.handleAddUser}  data-original-title="" title="">Add User</a>&nbsp;
          <a className="btn btn-success" data-original-title="" title="">Import CSV</a>&nbsp;
          <a className="btn btn-success" data-original-title="" title="">Import Auto CSV</a>
         </span>
         {this.state.ObjOrganizations} » Users
          </h2>
          
         <div className="wice-grid-container table-responsive" data-grid-name="grid" id="grid">
           <div id="grid_title"></div>
    <table className="table-striped table-bordered table wice-grid">
      <thead>
        <tr className="wice-grid-title-row">
          <th className=""><a data-original-title="" title="">First</a></th>
          <th className=""><a data-original-title="" title="">Last</a></th>
          <th className="sorted"><a className="asc"  data-original-title="" title="">Email</a></th>
          <th className=""><a  data-original-title="" title="">Location</a></th>
          <th className=""><a data-original-title="" title="">Status</a></th>
          <th className=""><a  data-original-title="" title="">Group</a></th>
          <th className="text-right text-right">User Level</th>
          <th className=""></th>
          <th className=""></th>
        </tr>
          <tr className="wg-filter-row" id="grid_filter_row">
          <th className="">
		  
		  <input className="form-control input-sm"
		  id="grid_first_name"
		  name="grid_first_name"
		  size="8"
		  type="text"
		  onKeyPress={this.handleFirstNameKeyPress} />
		  </th>
          <th className="">
		  <input className="form-control input-sm"
		  id="grid_last_name"
		  name="grid_last_name"
		  size="8"
		  type="text"
		  onKeyPress={this.handleLastNameKeyPress} />
		  </th>
          <th className="sorted sorted">
		  <input className="form-control input-sm"
		  id="grid_email"
		  name="grid_email"
		  size="8"
		  type="text"
		  onKeyPress={this.handleEmailKeyPress} />
		  </th>
          <th className="">
		  <input className="form-control input-sm"
		  id="grid_school"
		  name="grid_school"
		  size="8"
		  type="text"
		  onKeyPress={this.handleSchoolKeyPress} />
		  </th>
          <th className="">
            <div className="custom-dropdown-container">
              <select className="custom-dropdown form-control"
			  id="grid_active"
			  name="grid_active"
			  defaultValue="Active"
			  ref = {(input)=> this.menu = input}
			  onChange={this.handleStatusKeyPress}>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="All">All</option>
            </select>
            <span className="expand-multi-select-icon clickable" title="Expand"></span>
            <span className="collapse-multi-select-icon clickable" title="Collapse"></span>
          </div>
          </th>
          <th className="">
            <input className="form-control input-sm"
			id="grid_groups_name"
			name="grid_groups_name"
			size="8"
			type="text"
			onKeyPress={this.handleGroupKeyPress} />
			</th>
          <th className="text-right text-right"></th>
          <th className=""></th>
          <th className=" filter_icons">
            <div className="submit clickable" id="grid_submit_grid_icon" title="Filter"></div> 
            <div className="reset clickable" id="grid_reset_grid_icon" title="Reset"></div>
          </th>
        </tr>
        </thead>
        <tbody>
         {userList}
        </tbody>
      </table>
	  <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={30}
          totalItemsCount={this.state.total_count}
          pageRangeDisplayed={5}
		  onChange={this.handlePageChange.bind(this)}
        />
      </div>
<div className="wg-data">
<div className="pagination_status">{this.state.prefix_limit}-{per_page_total} / {this.state.total_count} <a className="wg-show-all-link" href="#" title="" data-original-title="Show all records">show all</a></div>
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

export default User;
