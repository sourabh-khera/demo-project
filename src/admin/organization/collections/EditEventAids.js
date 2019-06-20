import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'


class AddEventAids extends Component {
    constructor(props){
        super(props);
        this.state = {
        chart_title: '',
		chart_priority: 0,
        chart_loggable: 'false',
        ObjOrganizations: [],
        ObjCollections: [],
		ObjChart: [],
		items: [],
        fields: {},
        organization_template: {},
        collection_template: {},
		chart_template: {},
        error: {}
        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectPlan=this.redirectPlan.bind(this);
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
	 redirectPlan(e)
     {
	  this.props.history.push('/collections/Collections?organization='+ e);
     }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  const collectionid = query.get('collectionid');
	  const chartid = query.get('chartid');
	  let chart_loggable_isChecked = document.getElementById('chart_loggable').checked;
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  let userid = session_array.id;
     //action 
     fields["action"]="editChart";
     fields["organizationid"]=organizationid;
	 fields["collectionid"]=collectionid;
	 fields["chart_loggable"]=chart_loggable_isChecked;
	 fields["userid"]=userid;
	 fields["chartid"]=chartid;
	 let chart_title = document.getElementById('chart_title').value;
      //chart_title
      if(chart_title==''){
         formIsValid = false;
         errors["chart_title"] = "Cannot be empty";
      }else{
		  fields["chart_title"]=chart_title;
	  }
     this.setState({errors: errors});
     return formIsValid;
    }
    
    chartSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
		  console.log(this.state.fields);
        this.editChartApi();
        console.log(this.state.fields);
      }else{
         alert("Mandatory Field Emplty!");
      }
    
    }
    handleChangeLoggable(field, e){         
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


GetChartDetails(){
let chart_template = this.state.chart_template;
let ObjChart = this.state.ObjChart;
chart_template["action"]="detailChart";
const query = new URLSearchParams(this.props.location.search);
const organizationid = query.get('organization');
const collectionid = query.get('collectionid');
const chartid = query.get('chartid');
chart_template["organizationid"]=organizationid;
chart_template["collectionid"]=collectionid;
chart_template["chartid"]=chartid;
fetch(global.api_url,
   {
	   method: 'POST',
	   headers: {
		   Accept: 'application/json',
		   'Content-Type': 'application/json'
	   },
	   body: JSON.stringify(this.state.chart_template)
   })
	.then((response) => response.json())
	.then((response) => { 
	  const status=response.status;
	  const details = response.details;
	 if(status === "true")
	 {
	  this.setState({
		ObjChart: details
	})
	 }       
});
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
 console.log(this.ObjCollection);       
    }
    
    editChartApi()
    {
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  const collectionid = query.get('collectionid');
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
			  this.props.history.push('/EventAids?action=edit&organization='+organizationid+'&collectionid='+collectionid);
			  window.location.reload();
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
    this.GetCollectionDetails();
	this.GetChartDetails();
  }

  render() {
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');
	
	let sessiondata= localStorage.getItem("session");
      let sdata=JSON.parse(sessiondata);
      let user_id = sdata.id;
	  let organization_id = sdata.organization_id;
	
	let chart_loggable_checkbox;
    let chart_loggable_checkbox_val = this.state.ObjChart.loggable;
    if(chart_loggable_checkbox_val == 1){
      chart_loggable_checkbox = (
  <input
  type="checkbox"
  defaultChecked="true"
  id="chart_loggable"
  name="chart_loggable" />
       );
    }else if(chart_loggable_checkbox_val == 0){
      chart_loggable_checkbox = (
        <input
        type="checkbox"
        id="chart_loggable"
        name="chart_loggable" />
             );
    }else{
    }
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
          <li><a className="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
              <li className="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li className=""><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
            <li><a data-confirm="Are you sure you want to log out?" onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
           <a className="" onClick={this.redirectOrganization}  data-original-title="" title="">Admin</a> » <a className="" onClick={()=>this.redirectPlan(organizationid)} data-original-title="" title="">Plans</a> » <a className="" data-original-title="" title=""></a> »
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
          <h2>Edit Tab</h2>
  
  <form acceptCharset="UTF-8"
  onSubmit= {this.chartSubmit.bind(this)}
  className="new_chart"
  id="new_chart">
<div>
	<input name="utf8" type="hidden" value="✓"/>
	<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M="/>
	</div> 
  <div className="form-group">
      <label htmlFor="chart_title">Title</label>:
      <input className="form-control"
     id="chart_title" 
     name="chart_title" 
     type="text" 
     onChange={this.handleChangeName.bind(this, "chart_title")}
	 defaultValue ={this.state.ObjChart.title} 
     />
    </div>
    <div className="form-group">
	<label htmlFor="chart_priority">Priority</label>
    <input className="form-control"
     id="chart_priority" 
     name="chart_priority" 
     type="text" 
     onChange={this.handleChangeName.bind(this, "chart_priority")}
	 defaultValue ={this.state.ObjChart.priority}
     />
    </div>
    <div className="form-group">
    {chart_loggable_checkbox}
      <label htmlFor="chart_loggable">&nbsp;Loggable</label>
    </div>
    <div className="form-group">
      <input className="btn btn-success" name="commit" type="submit" value="Save"/>
    </div>
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
export default AddEventAids;