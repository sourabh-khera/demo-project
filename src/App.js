import React, { Component } from 'react';
import logo from './logo.svg';
import Home from './Home';
import Login from './Login';
import Organization from './admin/Organization'
import EditProfile from './admin/EditProfile'
import compose from './compose'
import emergency from './emergency'
import shooter from './shooter'
import messages from './messages'
import Addorganization from './admin/organization/Addorganization'
import Edit from './admin/organization/Edit'
import Variables from './admin/organization/Variables'
import Groups from './admin/organization/groups/Groups'
import Attachment from './admin/organization/file_attachments/Attachment'
import AddFileFolder from './admin/organization/file_attachments/AddFileFolder'
import AddFile from './admin/organization/file_attachments/AddFile'
import Collections from './admin/organization/collections/Collections'
import User from './admin/organization/users/User'
import AddUser from './admin/organization/users/AddUser'
import EditUser from './admin/organization/users/EditUser'
import AddGroup from './admin/organization/groups/AddGroup'
import EditGroup from './admin/organization/groups/EditGroup'
import AddCollections from './admin/organization/collections/AddCollections'
import EventAids from './admin/organization/collections/EventAids'
import ViewTasks from './admin/organization/collections/ViewTasks'
import EditTasks from './admin/organization/collections/EditTasks'
import AddEventAids from './admin/organization/collections/AddEventAids'
import EditEventAids from './admin/organization/collections/EditEventAids'
import SupportingMaterials from './admin/organization/collections/SupportingMaterials'
import CollectionSupportingMaterials from './admin/organization/collections/CollectionSupportingMaterials'
import EditCollections from './admin/organization/collections/EditCollections'
import Profile from './Profile';
import Collection from './Collection';
import help from './help';
import Doc from './Doc';
import Charts from './Charts';
import Page from './components/Page';
import MultiPage from './components/MultiPage';
import PrintButton from './components/PrintButton';
import ChartsAction from './ChartsAction';
import PDFViewer from './components/PDFViewer/PDFViewer';
import { BrowserRouter as Router, NavLink, Switch, Link, Route ,HashRouter} from 'react-router-dom';
class App extends Component { 
constructor(){
    super();
    // Creating Global Variable.
    global.api_url = 'https://aro-crm.com/merpapi/api.php';
  }

  render() {
    return (
       <Router>
       <Route exact path="/" component={Login}></Route>
       <Route   path="/Home" component={Home}></Route>
       <Route   path="/Collection" component={Collection}></Route>
	   <Route   path="/help" component={help}></Route>
	   <Route   path="/Doc" component={Doc}></Route>
	   <Route   path="/Charts" component={Charts}></Route>
	   <Route   path="/ChartsAction" component={ChartsAction}></Route>
	   <Route   path="/Page" component={Page}></Route>
	   <Route   path="/MultiPage" component={MultiPage}></Route>
	   <Route   path="/PrintButton" component={PrintButton}></Route>
       <Route   path="/Login" component={Login}></Route>
       <Route   path="/Organization" component={Organization}></Route>
	   <Route   path="/EditProfile" component={EditProfile}></Route>
	   <Route   path="/compose" component={compose}></Route>
	   <Route   path="/emergency" component={emergency}></Route>
	   <Route   path="/shooter" component={shooter}></Route>
	   <Route   path="/messages" component={messages}></Route>
       <Route   path="/Addorganization" component={Addorganization}></Route>
       <Route   path="/Edit" component={Edit}></Route>
       <Route   path="/groups/Groups" component={Groups}></Route>
       <Route   path="/AddGroup" component={AddGroup}></Route>
       <Route   path="/EditGroup" component={EditGroup}></Route>
       <Route   path="/users/User" component={User}></Route>
       <Route   path="/AddUser" component={AddUser}></Route>
       <Route   path="/EditUser" component={EditUser}></Route>
       <Route   path="/collections/Collections" component={Collections}></Route>
	   <Route   path="/AddCollections" component={AddCollections}></Route>
       <Route   path="/EventAids" component={EventAids}></Route>
	   <Route   path="/AddEventAids" component={AddEventAids}></Route>
	   <Route   path="/ViewTasks" component={ViewTasks}></Route>
	   <Route   path="/EditTasks" component={EditTasks}></Route>
	   <Route   path="/PDFViewer" component={PDFViewer}></Route>
	   <Route   path="/EditEventAids" component={EditEventAids}></Route>
	   <Route   path="/SupportingMaterials" component={SupportingMaterials}></Route>
	   <Route   path="/CollectionSupportingMaterials" component={CollectionSupportingMaterials}></Route>
	   <Route   path="/EditCollections" component={EditCollections}></Route>
	   <Route   path="/Variables" component={Variables}></Route>
	   <Route   path="/Attachment" component={Attachment}></Route>
	   <Route   path="/AddFileFolder" component={AddFileFolder}></Route>
	   <Route   path="/AddFile" component={AddFile}></Route>
       <Route   path="/Profile" component={Profile}></Route>
       </Router>
    );
  }
}

export default App;