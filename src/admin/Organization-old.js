import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
import Pagination from "react-js-pagination";
import Addorganization from './organization/Addorganization'
import '../assets/css/application.css';

class Organization extends Component {

  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
	  organization_delete_template: {},
	  activePage: 30,
	  serach_name: '',
      ObjOrganizations: []
    }
    this.GotoaddOrg=this.GotoaddOrg.bind(this);
    this.handleSort=this.handleSort.bind(this);
	this.contentVariables=this.contentVariables.bind(this);
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.organizationSorting=this.organizationSorting.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
    this.editOrganization=this.editOrganization.bind(this);
	this.handleKeyPress = this.handleKeyPress.bind(this);
 }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }
  GotoaddOrg(){
  this.props.history.push('/Addorganization');
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
	this.props.history.push('/Organization');
	window.location.reload();
	}
	organizationSorting(){
		this.props.history.push('/Organization?order=desc');
		window.location.reload();
	}
	redirectDashboard(){
		this.props.history.push('/Collection');
	}
	
deleteOrganizationSubmit(organizationid)
{
	  /*confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete this user',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.deleteOrganization(organizationid)
        },
        {
          label: 'No',
        }
      ]
    });*/
	  
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
    localStorage.clear();
    window.location.href = '/';
}

handleKeyPress = (event) => {
  if(event.key == 'Enter'){
	const search_name = event.target.value;
    this.props.history.push('/Organization?search='+search_name);
	window.location.reload();
  }
}

componentDidMount() {
  this.GetOrganizationList();
}

GetOrganizationList(){
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
       if(status === "true")
       {
        this.setState({
          ObjOrganizations: response.template
      })
		
       }       
 });
 
}

      render() {
      const query = new URLSearchParams(this.props.location.search);
      const success = query.get('success');
	  let sucess_message
	  let record_sort
	  if(success=='true')
	  {
		  sucess_message = <div data-alert="" class="alert alert-success">Organization successfully created!</div>;
	  }else{
		  sucess_message = '';
	  }
	  
	  const order = query.get('order');
	  if(order=='desc')
	  {
	   record_sort = <a class="asc" onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> ;	  
	  }else{
		record_sort = <a class="asc" onClick={this.organizationSorting} data-original-title="" title="">Organization</a> ; 
	  }
	  
	  
      let organizationList = this.state.ObjOrganizations.map(v => (
      <tr>
        <td class="sorted">{v.name}</td>
        <td>
        <div class={"label " + v.class}>{v.active}</div>   
        </td>
        <td class="text-right">
          <a class="btn btn-sm btn-default" onClick={()=>this.handlePlans(v.id)}  data-original-title="" title="">Plans</a>
          <a class="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.supportingFiles(v.id)}>Supporting Files</a>
          <a class="btn btn-sm btn-default" data-original-title="" title="">Incident Logs</a>
          <a class="btn btn-sm btn-default" onClick={()=>this.handleSort(v.id)} data-original-title="" title="">Groups</a>
          <a class="btn btn-sm btn-default" onClick={()=>this.handleUser(v.id)} data-original-title="" title="">Users ({v.user_count})</a>
          <a class="btn btn-sm btn-default" data-original-title="" title="" onClick={()=>this.contentVariables(v.id)}>Content Variables</a>
          <a class="btn btn-sm btn-default" onClick={()=>this.editOrganization(v.id)} data-original-title="" title="">Edit</a>
          <a class="btn btn-sm btn-default" onClick={()=>this.deleteOrganizationSubmit(v.id)} data-method="DELETE" rel="nofollow" data-original-title="" title="">Delete</a>
        </td>
    </tr>
    ));


    return (
      <div>
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
        <li><a class="home" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
            <li class="active"><a href="organisation.html" data-original-title="" title="">Admin</a></li>
          <li class=""><a href="edit-admin-profile.html" data-original-title="" title="">Edit Profile</a></li>
          <li><a onClick= {this.logout}>Log Out</a></li>
      </ul>
    </div>
  </div>
</div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12">
        <a class="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » Organizations
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
		 {sucess_message}
          <h2 class="">
    <span class="pull-right">
      <a class="btn btn-success" onClick={this.GotoaddOrg} data-original-title="" title="">Add Organization</a>
    </span>
    Organizations
</h2>

<div class="wice-grid-container table-responsive" data-grid-name="grid" id="grid"><div id="grid_title"></div>
<table class="table-striped table-bordered table wice-grid table table-striped">
  <thead>
    <tr class="wice-grid-title-row">
      <th class=" sorted">{record_sort}</th>
      <th class="">Status</th>
      <th class="text-right text-right"></th>
    </tr>
    <tr class="wg-filter-row" id="grid_filter_row">
      <th class="sorted sorted">
	  <input class="form-control input-sm"
	  id="grid_name"
	  name="grid_name"
	  size="8"
	  type="text"
	  onKeyPress={this.handleKeyPress} />
	  </th>
      <th class=""></th><th class="text-right text-right filter_icons"><div class="submit clickable" id="grid_submit_grid_icon" title="Filter"></div> <div class="reset clickable" id="grid_reset_grid_icon" title="Reset"></div>
      </th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td colspan="3">
	  <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={30}
          totalItemsCount={156}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </div>
  
</td>
</tr>
</tfoot>
<tbody>
   {organizationList}

</tbody>
</table>
<div class="wg-data" data-filter-declarations="[{&quot;filterName&quot;:&quot;Organization&quot;,&quot;detached&quot;:&quot;false&quot;,&quot;declaration&quot;:{&quot;templates&quot;:[&quot;grid%5Bf%5D%5Bname%5D=&quot;],&quot;ids&quot;:[&quot;grid_f_name&quot;]}}]" data-processor-initializer-arguments="[&quot;http://mobileemergencyresponseplans.com/admin/organizations&quot;,&quot;http://mobileemergencyresponseplans.com/admin/organizations&quot;,&quot;http://mobileemergencyresponseplans.com/admin/organizations?grid%5Bexport%5D=csv&quot;,&quot;grid%5Bq%5D=&quot;,&quot;grid%5Bfoc%5D=&quot;,&quot;production&quot;]"></div>
</div>

        </div>
      </div>
   
	<div class="modal fade" id="siteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					<h4 class="modal-title" id="myModalLabel">Programs Library</h4>
				</div>
				<div class="modal-body">
					...
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
  
  </div>
</div>

     
    );
  }
}

export default Organization;
