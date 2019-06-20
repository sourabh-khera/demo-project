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
		items: [],
        fields: {},
        organization_template: {},
        collection_template: {},
        error: {}
        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectPlan=this.redirectPlan.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
     }
	 redirectDashboard(){
	 this.props.history.push('/Collection');
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
	  let chart_loggable_isChecked = document.getElementById('chart_loggable').checked;
	  let session= localStorage.getItem("session");
      let session_array=JSON.parse(session);
	  let userid = session_array.id;
     //action 
     fields["action"]="createChart";
     fields["organizationid"]=organizationid;
	 fields["collectionid"]=collectionid;
	 fields["chart_loggable"]=chart_loggable_isChecked;
	 fields["userid"]=userid;
      //chart_title
      if(!fields["chart_title"]){
         formIsValid = false;
         errors["chart_title"] = "Cannot be empty";
      }
     this.setState({errors: errors});
     return formIsValid;
    }
    
    chartSubmit(e){
      e.preventDefault();
      if(this.handleValidation()){
		  console.log(this.state.fields);
        this.createChartApi();
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
    
    createChartApi()
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
			  this.props.history.push('/EventAids?action=create&organization='+organizationid+'&collectionid='+collectionid);
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
  }

  render() {
	const query = new URLSearchParams(this.props.location.search);
    const organizationid = query.get('organization');  
    let collectionList = this.state.ObjCollections.map(v => (
        <div>
          <input id="{v.id}"
           name="group_collection_id"
           type="checkbox"
           value={v.id}
           className="group_collection"
		   onChange={this.onToggle.bind(this)}
           />
          <label for="{v.id}">&nbsp;{v.title}</label>
        </div>
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
          <li><a className="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
              <li className="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li className=""><a data-original-title="" title="">Edit Profile</a></li>
            <li><a data-confirm="Are you sure you want to log out?" onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
           <a className="" onClick={this.redirectOrganization}  data-original-title="" title="">Admin</a> » <a className="" onClick={()=>this.redirectPlan(organizationid)} data-original-title="" title="">Plans</a> » <a className="" data-original-title="" title=""></a> » New
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
          <h2>New Tab</h2>
  
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
     value={this.state.fields["chart_title"]}
     />
    </div>
    <div className="form-group">
	<label htmlFor="chart_priority">Priority</label>
    <input className="form-control"
     id="chart_priority" 
     name="chart_priority" 
     type="text" 
     onChange={this.handleChangeName.bind(this, "chart_priority")}
     value={this.state.fields["chart_priority"]}
     />
    </div>
    <div className="form-group">
    <input 
    onChange={this.handleChangeLoggable.bind(this,'chart_loggable')}
    type="checkbox"
    value={this.state.fields["chart_loggable"]}
    id="chart_loggable" 
    name="chart_loggable" />
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