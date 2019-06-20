import React, { Component } from 'react';
import Select from 'react-select';
import queryString from 'query-string'
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
import axios from 'axios';

class AddFile extends Component {
    constructor(props){
        super(props);
        this.state = {
        name: '',
        ObjOrganizations: [],
        ObjFolder: [],
        fields: {},
        organization_template: {},
		file_attachment_attachment: null,
		file_attachment_file_folder_id: '',
        folder_template: {},
        error: {},
        selectedFile: null,
        pathname:null,

        }
        this.redirectOrganization=this.redirectOrganization.bind(this);
		this.redirectDashboard=this.redirectDashboard.bind(this);
     }
     
	 redirectDashboard(){
	 this.props.history.push('/Collection');
	 }
     handleValidation(){
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
	  let file_attachment_cache_on_app_isChecked = document.getElementById('file_attachment_cache_on_app').checked;
	  fields["file_attachment_cache_on_app"] = file_attachment_cache_on_app_isChecked;
	  
     //action 
     fields["action"]="createFile";
     fields["organizationid"]=token;
    this.setState({errors: errors});
     return formIsValid;
    }
    
    fileSubmit(e){
      e.preventDefault();
     if(this.handleValidation()){
        
	const data = new FormData()
    data.append('file_attachment_attachment', this.state.selectedFile)
    console.log(data);
	axios.post("http://3.89.110.194:8000/uploadimage", data, {
   })
   .then(res => {
     console.log(res.data.path);
     let fields = this.state.fields;
	  fields["filepath"] = res.data.path;
	  console.log(this.state.fields);
	  this.createFileApi();
  })
     }else{
    alert("Mandatory Field Emplty!");
     }
    
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

    GetFolderList(){
      let folder_template = this.state.folder_template;
      let ObjFolder = this.state.ObjFolder;
      folder_template["action"]="getFolderList";
      const query = new URLSearchParams(this.props.location.search);
      const organizationid = query.get('organization');
      folder_template["organizationid"]=organizationid;
      fetch(global.api_url,
         {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(this.state.folder_template)
         })
          .then((response) => response.json())
          .then((response) => { 
            const status=response.status;
            const folder_details = response.list;
           if(status === "true")
           {
            this.setState({
              ObjFolder: folder_details
          })

           }       
     });
     
    }
    
    createFileApi()
    {
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('organization');
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
              this.props.history.push('/Attachment?success=true&organization='+ token);
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

  uploadFiles(field, e) {
    console.log(e);
		this.setState({
        selectedFile: e.target.files[0],
        loaded: 0,
      })

   console.log(this.state.selectedFile);
   let fields = this.state.fields;
   switch (e.target.name) {
   case 'file_attachment_attachment':
   if(e.target.files.length > 0) {
   this.setState({ fileName: e.target.files[0].name });
   fields[field] = e.target.files[0].name;
   this.setState({fields});
   }
   break;
   default:
   this.setState({ [e.target.name]: e.target.value });
   } 
   }

  componentDidMount() {
    this.GetOrganizationDetail();
    this.GetFolderList();
  }

  render() {  
	let folderList = this.state.ObjFolder.map(v => (
	 <option value={v.id}>{v.name}</option>
    ));
	if (localStorage.getItem('session')) {
    return (
        <div className="bodyscroll">
    <div className="navbar navbar-inverse navbar-static-top" role="navigation">
    <div className="container">
      <div className="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span  className="sr-only">Toggle navigation</span>
          <span  className="icon-bar"></span>
          <span  className="icon-bar"></span>
          <span  className="icon-bar"></span>
        </button>
      </div>
      <div  className="navbar-collapse collapse">
        <ul  className="nav navbar-nav navbar-left">
          <li><a  className="home1" onClick={this.redirectDashboard} data-original-title="" title="">Arodek</a></li>
        </ul>
        <ul  className="nav navbar-nav navbar-right">
              <li  className="active"><a onClick={this.redirectOrganization} data-original-title="" title="">Admin</a></li>
            <li  className=""><a data-original-title="" title="">Edit Profile</a></li>
            <li><a onClick= {this.logout} rel="nofollow" data-original-title="" title="">Log Out</a></li>
        </ul>
      </div>
    </div>
  </div>
  
      <div  className="container">
        <div  className="row">
          <div  className="col-xs-12">
          <a  className="" onClick={this.redirectOrganization} data-original-title="" title="">Admin</a> » <a  className="" onClick={this.redirectOrganization} data-original-title="" title="">Organization</a> » <a  className="" data-original-title="" title="">Supporting Files</a>
          </div>
        </div>
        <div  className="row">
          <div  className="col-xs-12">
          <h2>Create Supporting File</h2>
  
  <form accept-charset="UTF-8"
  onSubmit= {this.fileSubmit.bind(this)}
   className="new_file_folder"
  id="new_file_folder">
<div>
	<input name="utf8" type="hidden" value="✓"/>
	<input name="authenticity_token" type="hidden" value="0qg+Ew1bfTQhYZVeILoFPOUpwulCQXei6e+JejzmK9M="/>
	</div>
 
   <div  className="form-group">
        <input 
         className="form-control" 
        id="file_attachment_attachment" 
        name="file_attachment_attachment" 
        type="file" 
        onChange={this.uploadFiles.bind(this, "file_attachment_attachment")} />
      </div>
    <div  className="form-group">
      <label for="file_attachment_file_folder_id">File folder</label>&nbsp;
      <select
	  id="file_attachment_file_folder_id"
	  name="file_attachment_file_folder_id"
	  ref = {(input)=> this.menu = input}
      value={this.state.fields["file_attachment_file_folder_id"]}
      onChange={this.handleChangeName.bind(this, "file_attachment_file_folder_id")}
	  >
	  <option value="">None</option>
	  {folderList}
	  </select>
    </div>
    <div  className="form-group">
      <input name="file_attachment[cache_on_app]" type="hidden" value="0" />
	  <input id="file_attachment_cache_on_app" name="file_attachment_cache_on_app" type="checkbox" value="1" />&nbsp;
      <label for="file_attachment_cache_on_app">Make this file available for offline use in the mobile app?</label><br/>
      <small><em>Note: Marking files as available for offline use in the mobile app leads to longer load times.</em></small>
    </div>
    <div  className="form-group">
      <input  className="btn btn-success" name="commit" type="submit" value="Upload" />
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
export default AddFile;