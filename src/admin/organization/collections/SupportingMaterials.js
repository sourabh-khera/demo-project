import React, { Component } from 'react';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import TinyMCE from 'react-tinymce';
import { Editor } from '@tinymce/tinymce-react';
import alasql from 'alasql';
import decode from 'decode-html';
import Base64 from 'base-64';

class SupportingMaterials extends Component {
  constructor(props){
    super(props);
    this.state = {
    organization_template: {},
	collection_template: {},
	chart_template: {},
    viewtask_template: {},
	 fields: {},
    ObjOrganizations: '',
	  ObjCollection:[],
	  ObjCharts:[],
	  content: '',
    ObjViewTasks: []
    }
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.redirectPlan=this.redirectPlan.bind(this);
	this.redirectEventAids=this.redirectEventAids.bind(this);
	this.handleEditorChange = this.handleEditorChange.bind(this);
	this.editProfile=this.editProfile.bind(this);
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
	  redirectEventAids(organizationid,collectionid)
	  {
		  this.props.history.push('/EventAids?organization='+organizationid+'&collectionid='+collectionid);
	  }
	  editProfile(user_id,organizationid)
	  {
      this.props.history.push('/EditProfile?userid='+ user_id+'&organization='+ organizationid);
      }

  logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
componentWillMount()
{
	this.GetChartDetails();
}
componentDidMount() {
  this.GetOrganizationDetail();
  this.GetCollectionDetails();
}

handleEditorChange(e) {
    console.log(e.target.getContent());
	this.setState({
          content: e.target.getContent()
      })
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


GetChartDetails(){
let chart_template = this.state.chart_template;
let ObjCollection = this.state.ObjCollection;
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
	  const details=[] ;
	  details.push(response.details);
	 if(status === "true")
	 {
	  this.setState({
		ObjCharts: details
	})
	 }else{
	 }
});       
}



handleValidation(){
let fields = this.state.fields;
let errors = {};
let formIsValid = true;
const query = new URLSearchParams(this.props.location.search);
const organization = query.get('organization');
const collectionid = query.get('collectionid');
const chartid = query.get('chartid');
const chart_content = this.state.content;
//action 
fields["action"]="updateChartContent";
fields["organizationid"]=organization;
fields["collectionid"]=collectionid;
fields["chartid"]=chartid;
fields["content"]=chart_content;

//organization_name
if(chartid==''){
 formIsValid = false;
}
this.setState({errors: errors});
return formIsValid;
}
chartSubmit(e){
e.preventDefault();
if(this.handleValidation()){
this.updateChartContentApi();
console.log(this.state.fields);
}else{
 alert("Mandatory Field Emplty!");
}
}

updateChartContentApi()
{
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  const collectionid = query.get('collectionid');
	  const chartid = query.get('chartid');
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
              this.props.history.push('/SupportingMaterials?organization='+organizationid+'&collectionid='+collectionid+'&chartid='+chartid);
			  window.location.reload();
           }
           else{
              alert("Something went wrong, please try again");
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
	
	let supporting_materials_content = this.state.ObjCharts.map(v => (
	  Base64.decode(v.supporting_materials_content)
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
              <li><a data-original-title="" onClick={()=>this.editProfile(user_id,organization_id)}>Edit Profile</a></li>
              <li><a onClick= {this.logout} data-method="delete"  rel="nofollow" data-original-title="" title="">Log Out</a></li>
          </ul>
        </div>
      </div>
    </div>
	
	<div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a data-original-title="" onClick={this.redirectOrganization}>Admin</a> » <a data-original-title="" onClick={this.redirectOrganization}>Organization</a> » <a data-original-title="" onClick={()=>this.redirectPlan(organizationid)}>Plans</a> » <a data-original-title="" onClick={()=>this.redirectEventAids(organizationid,collectionid)}>{this.state.ObjCollection.title}</a> » {title}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 chart_header">
              <h2>Event Aids</h2>
             <h3>{this.state.ObjCollection.title} - {title}</h3>
			 
			 <form acceptCharset="UTF-8"
			 className="edit_supporting_material"
			 id="edit_supporting_material_13828"
			 onSubmit= {this.chartSubmit.bind(this)}>
			 <div className="material_editor">
			 <div className="form-group">
            <div className="src-editor-controls">
                <input className="btn btn-success save" name="commit" type="submit" value="Save"/>
                <a data-role="source" className="source" href="#" data-original-title="" title="">Visual Editor</a>
            </div>
            <label htmlFor="supporting_material_title">Title</label>:
            <input className="form-control supporting_material_title_field"
			id="supporting_material_title"
			name="supporting_material_title"
			type="text"
			defaultValue={supporting_material_title}/>
            <label htmlFor="supporting_material_content">Content</label>:
        </div>
		<h2 className="supporting_material_title" contenteditable="true">{supporting_material_title}</h2>     
			
	   <Editor
		value={decode(supporting_materials_content.toString())}
        init={{
			menubar:false,
            statusbar: false,
         plugins: 'autolink link image lists print preview code autoresize',
          toolbar: 'undo redo | code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat'
        }}
        onChange={this.handleEditorChange}
      />
			 <input name="commit" type="submit" value="Update Supporting material"/>
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

export default SupportingMaterials;