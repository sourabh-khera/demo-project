import React, { Component } from 'react';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import alasql from 'alasql';
import TinyMCE from 'react-tinymce';
import { Editor } from '@tinymce/tinymce-react';
import decode from 'decode-html';
import Base64 from 'base-64'

class EditTasks extends Component {
  constructor(props){
    super(props);
    this.state = {
      organization_template: {},
      viewtask_template: {},
	  fields: {},
	  collection_template: {},
	  card_template: {},
      ObjOrganizations: '',
      ObjViewTasks: [],
	  ObjCharts: [],
	  ObjCollection : [],
	  ObjCard : [],
	  ObjDestinationCard : [],
	  content: '',
	  textareaValue : ''
    }
    this.redirectOrganization=this.redirectOrganization.bind(this);
	this.redirectDashboard=this.redirectDashboard.bind(this);
	this.redirectEventAids=this.redirectEventAids.bind(this);
	this.redirectPlan=this.redirectPlan.bind(this);
	this.handleEditorChange = this.handleEditorChange.bind(this);
    }

	  redirectOrganization(){
	  this.props.history.push('/Organization');
	  }
	  redirectDashboard(){
	  this.props.history.push('/Collection');
	  }
	  redirectPlan(e){
	  this.props.history.push('/collections/Collections?organization='+ e);
	  }
	  redirectViewTasks(organizationid,collectionid,chartid){
	  this.props.history.push('/ViewTasks?chartid='+chartid+'&organization='+organizationid+'&collectionid='+collectionid);
	  }
	  redirectEventAids(organizationid,collectionid) {
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
  this.getCardDetails();
}

handleEditorChange(e) {
console.log(e.target.getContent());
this.setState({
content: e.target.getContent()
})
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

getCardDetails()
{
const query = new URLSearchParams(this.props.location.search);
const organizationid = query.get('organization');
const collectionid = query.get('collectionid');	
const card_id = query.get('card_id');
const chartid = query.get('chartid');
let card_template = this.state.card_template;
let ObjCard = this.state.ObjCard;
card_template["action"]="getCardDetails";
card_template["organizationid"]=organizationid;
card_template["collectionid"]=collectionid;
card_template["chartid"]=chartid;
card_template["card_id"]=card_id;
fetch(global.api_url,
   {
	   method: 'POST',
	   headers: {
		   Accept: 'application/json',
		   'Content-Type': 'application/json'
	   },
	   body: JSON.stringify(this.state.card_template)
   })
	.then((response) => response.json())
	.then((response) => { 
	  const status=response.status;
	  const details = response.details;
	  const destination_details = response.destination_details;
	 if(status === "true")
	 {
	  this.setState({
		ObjCard: details,
		ObjDestinationCard: destination_details
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

handleValidation(){
let fields = this.state.fields;
let errors = {};
let formIsValid = true;
const query = new URLSearchParams(this.props.location.search);
const organization = query.get('organization');
const collectionid = query.get('collectionid');
const chartid = query.get('chartid');
const card_id = query.get('card_id');
const chart_content = this.state.content;
let action_title = document.getElementById('card_actions_attributes_content').value;
fields["action"]="updateCardContent";
fields["organizationid"]=organization;
fields["collectionid"]=collectionid;
fields["chartid"]=chartid;
fields["card_id"]=card_id;
fields["content"]=chart_content;
fields["action_title"]=action_title;
if(card_id==''){
 formIsValid = false;
}
this.setState({errors: errors});
return formIsValid;
}

cardSubmit(e){
e.preventDefault();
if(this.handleValidation()){
this.updateCardContentApi();
console.log(this.state.fields);
}else{
 alert("Mandatory Field Emplty!");
}
}

handleOnChange(event) {
    this.setState({
      textareaValue: event.target.value
    })
  }

updateCardContentApi()
{
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
	  const collectionid = query.get('collectionid');
	  const chartid = query.get('chartid');
	  const card_id = query.get('card_id');
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
			  window.location.reload();
           }
           else{
              alert("Something went wrong, please try again");
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
	const chartid = query.get('chartid');
	console.log(this.state.ObjCard);
	console.log(this.state.ObjDestinationCard);
	
	let title = this.state.ObjCharts.map(v => (
	  v.title
    ));
	
	let action_title = this.state.ObjCard.action_content;
	
	let content = Base64.encode(this.state.ObjCard.content);
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
                <li><a className="home" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                    <li className="active"><a href="/admin/organizations" data-original-title="" title="">Admin</a></li>
                  <li className=""><a data-original-title="" title="">Edit Profile</a></li>
               <li><a data-method="delete" rel="nofollow" data-original-title="" title="Log Out">Log Out</a></li>
              </ul>
            </div>
          </div>
        </div>
	
	<div className="container">
          <div className="row">
            <div className="col-xs-12">
            <a data-original-title="" onClick={this.redirectOrganization}>Admin</a> » <a data-original-title="" onClick={()=>this.redirectEventAids(organizationid,collectionid)}>{this.state.ObjCollection.title}</a> » <a data-original-title="" onClick={()=>this.redirectViewTasks(organizationid,collectionid,chartid)}>{title}</a> » {this.state.ObjCard.card_type}
          </div>
          </div>
          <div className="row">
          <div className="col-xs-12">
          <h1>Edit Tasks</h1>
              
		<div className="container">
        <form
		acceptCharset="UTF-8"
		className="edit_card"
		id="edit_card"
		onSubmit= {this.cardSubmit.bind(this)}>
		<div>
		<input name="utf8" type="hidden" value="✓" />
		<input name="_method" type="hidden" value="patch" />
		<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M=" />
		</div>
        <div className="row">
        <div className="col-md-6">
		<div className="form-group card_content_editor">
		<Editor
		value={decode(Base64.decode(content.toString()))}
        init={{
			menubar:false,
            statusbar: false,
         plugins: 'autolink link image lists print preview code autoresize',
          toolbar: 'undo redo | code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat'
        }}
        onChange={this.handleEditorChange}
      />
		</div>
        <br/>
        </div>
        <div className="col-md-6">
        <label>Card preview</label>
        <div className="card-preview-container">
        <div className={'title ' + this.state.ObjCard.card_type_lower}>{this.state.ObjCard.card_type}</div>
        <div className={'card-preview ' + this.state.ObjCard.card_type_lower}>
        {ReactHtmlParser(this.state.ObjCard.content)}
        </div>
        </div>
        </div>
        </div>
    
		<h2>Actions</h2>
		<div className="row">
		<div className="col-md-6">
		<div className="form-group">
		<label>Action Title</label>
		<textarea
		className="form-control"
		id="card_actions_attributes_content"
		name="card_actions_attributes_content"
		rows="4"
		value={action_title}
		onChange={(event) => this.handleOnChange(event)}>
		</textarea>
				
              </div>
            </div>
            <div className="col-md-1 arrow">
              <span className="glyphicon glyphicon-arrow-right"></span>
            </div>
            <div className="col-md-5">
              <div className="form-group">
              </div>
              <div className="form-group card-preview">
                  <div className={'title ' + this.state.ObjDestinationCard.card_type_lower}>{this.state.ObjDestinationCard.card_type}</div>
                  <div className={'card-preview ' + this.state.ObjDestinationCard.card_type_lower}>
                   {ReactHtmlParser(this.state.ObjDestinationCard.full_content)} 
                  </div>
              </div>
            </div>
          </div>
            <div className="form-group">
            <input className="btn btn-warning" name="apply" type="submit" value="Apply" />&nbsp;
            <input className="btn btn-success" name="save" type="submit" value="Save Tasks" />
            </div>
            </form>
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

export default EditTasks;