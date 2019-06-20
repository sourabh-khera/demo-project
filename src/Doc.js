import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Organization from './admin/Organization'
import Home from './Home';
import Login from './Login';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import alasql from 'alasql';

class Doc extends Component {
    constructor(props){
        super(props);
        this.state = {
          orgid:null,
          ObjFolder: [],
          ObjLinks:[],
          objfolderloading:false,
          openfolder:false,
          openfile:false

        }
        this.Gotoorg=this.Gotoorg.bind(this);
        this.GetFolderList=this.GetFolderList.bind(this);
        this.GotoHome=this.GotoHome.bind(this);
        this.Gotoorg=this.Gotoorg.bind(this);
        this.GotoHelp=this.GotoHelp.bind(this);
        this.GotoDoc=this.GotoDoc.bind(this);
        this.GotoProfile=this.GotoProfile.bind(this);

     }

Gotoorg(){
  this.props.history.push('/Organization');
  //alert("click");
  }

  GotoHome(){
    this.props.history.push('/Collection');

  }
GotoHelp(){
  this.props.history.push('/help');
}

GotoDoc(){
  this.props.history.push('/Doc');
}

GotoProfile(){
  this.props.history.push('/Profile');

}

  logout() {
    if (window.confirm("Are you sure you want to log out?")) {
  localStorage.clear();
  window.location.href = '/';
  }
}

     componentDidMount(){
       this.GetFolderList();
     }

     GetFolderList(){

      let sessiondata= localStorage.getItem("safeguard");
      let sdata=JSON.parse(sessiondata);

      console.log(sdata.folders);
      
            this.setState({
              ObjFolder: sdata.folders,
              orgisloading:false,
              openfolder:true
          })
       
     
    }


    // Gotoorg(){

    //     this.props.history.push('/Organization');
    //     //alert("click");
    // }

    Gotoopenfile(e){

      let safeguard= localStorage.getItem("safeguard");
      let safeguarddata=JSON.parse(safeguard);
      let filedata=safeguarddata.links;
      let res= alasql('SELECT * FROM ? where file_folder_id = ?', [filedata,e]);

      this.setState({
        ObjLinks:res,
        openfolder:false,
        openfile:true
      })
    }

    CloseFolder(){

      this.setState({
        openfolder:true,
        openfile:false
      })
    }

    logout() {
      localStorage.clear();
      window.location.href = '/';
  }



  render() {

    if(this.state.orgisloading){
      return <p>Loading ...</p>;
      
    }

    return (
      
      <div id="ember361" className="ember-view ember-app bodyStyle">
      <div className="menu">
      <ul>
        <li onClick= {this.GotoHome} className="home"><a data-ember-action="388">h</a></li>
        <li className="back"><a data-ember-action="389">M</a></li>
        <li className="titlebar">Arodek</li>
        <li className="logout" onClick= {this.logout}><a data-ember-action="391">o<span className="text">Logout</span></a></li>
        <li className="profile" onClick={this.GotoProfile}><a data-ember-action="392">u<span className="text">Profile</span></a></li>
        <li className="docs"><a data-ember-action="393">d<span className="text">Docs</span></a></li>
        <li className="help" onClick={this.GotoHelp}><a data-ember-action="394">?<span className="text">Help</span></a></li>
        
          <li className="admin" onClick={this.Gotoorg}><a href="/admin">c<span className="text">Admin</span></a></li>
        
      </ul>
    </div>
    <div id="application">
      <div id="ember1291" className="ember-view document-view"><div id="ember1295" className="ember-view document-view">
      <div className="overlay-container">
        <a className="close" data-ember-action="1296">x</a>
        <div className="document_menu">
          
            <a data-ember-action="1301" className="files_view">Files</a>
            <a data-ember-action="1302" className="materials_view">Emergency<br></br>Phone Numbers</a>
          
        </div>
        <div className="support_materials">
          
            <div className="files">
           
           {this.state.openfolder ?
           <div>
              
            { this.state.ObjFolder.map((fol) =>

                  <div className="folder" key={fol.id} onClick={()=>this.Gotoopenfile(fol.id)}>
                  <a data-ember-action="1374">{fol.name}</a> 
                  </div>
            )}
             </div>
              :null}
         
           
           
           {this.state.openfile ?
           <div>
              { this.state.ObjLinks.map((lin) =>
           <div>
           <div className="back" onClick={()=>this.CloseFolder()}><a data-ember-action="1430">Close FOLDER</a></div>
           <div className="file" key={lin.id}><img src={lin.url}/>
            <a data-ember-action="1427" href={lin.url} data-type="jpg" target="_blank">{lin.name}</a>
           </div>
           </div>
              )}
           </div>

          :null}

            </div>
          <div className="materials">
            <div id="accordion">
                <a data-collection-id="1036" data-bindattr-1317="1317" data-ember-action="1318" className="active">MERP EMERGENCY PHONE NUMBERS CONTACT LIST</a>
                <div data-collection-id="1036" data-bindattr-1320="1320" className="active">
                  <div className="supporting_material_content">
                    <div className="left-col">
    <h5><strong>FOR ALL EMERGENCIES CALL 911</strong></h5>
    <table border="0">
    <tbody>
    <tr><th>Contact</th><th>Number</th></tr>
    <tr>
    <td>Police/Fire/EMS</td>
    <td>911</td>
    </tr>
    </tbody>
    </table>
    <h5><strong>NON-EMERGENCY NUMBERS</strong></h5>
    <table border="0">
    <tbody>
    <tr><th>Contact</th><th>Number</th></tr>
    <tr>
    <td>Law Enforcement 1</td>
    <td><a href="tel:5555555555">555-555-5555</a></td>
    </tr>
    <tr>
    <td><span>Law Enforcement 2</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Law Enforcement 3</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Law Enforcement 4</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>Fire Department 1</td>
    <td><span>555-555-4321</span></td>
    </tr>
    <tr>
    <td><span>Fire Department 2</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Fire Department 3</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Fire Department 4</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Fire Department 5</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Electric Utility</span></td>
    <td><span>555-555-1234</span></td>
    </tr>
    <tr>
    <td><span>Gas Utility</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td><span>Water Utility</span></td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    </tbody>
    </table>
    <table border="0">
    <tbody>
    <tr><th>Abbreviation</th><th>Term</th></tr>
    <tr>
    <td>CCT&nbsp;</td>
    <td>Crisis Communications Team</td>
    </tr>
    <tr>
    <td>CRT</td>
    <td>Crisis Response Team</td>
    </tr>
    <tr>
    <td>ERP</td>
    <td>Emergency Response Plan</td>
    </tr>
    <tr>
    <td>HAZMAT</td>
    <td>Hazardous Materials</td>
    </tr>
    <tr>
    <td>IC</td>
    <td>Incident Commander</td>
    </tr>
    <tr>
    <td>CP</td>
    <td>&nbsp;Command Post</td>
    </tr>
    <tr>
    <td>ICS</td>
    <td>Incident Command System</td>
    </tr>
    <tr>
    <td>MSDS</td>
    <td>Material Safety Data Sheets</td>
    </tr>
    <tr>
    <td>NIMS</td>
    <td>National Incident Management System</td>
    </tr>
    <tr>
    <td>COM</td>
    <td>Public Information Officer/Executive Director of Communication</td>
    </tr>
    <tr>
    <td>SRO</td>
    <td>School Resource Officer</td>
    </tr>
    </tbody>
    </table>
    </div>
    <div className="right-col">
    <h3>MOBILE EMERGENCY RESPONSE PLAN</h3>
    <p><strong>Purpose and Scope:</strong> The Mobile Emergency Response Plan (MERP) provides guidance and direction to principals, faculty and staff who have emergency management responsibilities. The MERP should be used during an emergency incident. This information is not a complete list of all factors to be considered.</p>
    <p><strong>Key Emergency Contact:</strong> The key emergency phone number is 911. It is imperative during an emergency to contact your school’s Crisis Response Team as quickly as possible after calling 911.&nbsp;</p>
    <p><strong>Crisis Response Team (CRT):</strong> Each school facility will have a Crisis Response Team (CRT) to take charge of the emergency, respond effectively, protect the occupants of the facility and reduce the risk of physical injury, property damage and business interruption.</p>
    <p><strong>Incident Command System (ICS):</strong> The Crisis Response Team will follow the basic principles of ICS where one team member (Incident Commander, IC) is in charge of the emergency until emergency responders arrive on the scene. At that point the school IC, will update the emergency response IC on the incident and turn over the duties to the emergency response IC. The school IC should remain in close contact with the emergency response IC until the incident is terminated. The IC is responsible for command, control, communications and coordination of resources during an emergency event.</p>
    <p><strong>Flow Charts:</strong> Each incident has a flow chart for the IC and the CRT to follow in order to effectively stabilize and terminate the incident.</p>
    <p><strong>Event Aids:</strong> The event aids provide valuable information to assist the IC and the CRT in responding to an incident.</p>
    <p><strong>Emergency Phone Lists:</strong> Should be provided to ensure the emergency responders are quickly notified of an incident.</p>
    <p><strong>Evacuation Drawings:</strong> Should be uploaded to provide emergency responders and employees with vital evacuation, sheltering and lockdown information.</p>
    <p><strong>Roles &amp; Responsibilities:</strong> Key responsibilities of the CRT should be uploaded to give team members a general idea of their roles during an emergency incident.</p>
    <p><strong>Crisis Communications:</strong> The flow of information is critical during an emergency and this section will provide proactive communication measures.</p>
    </div>
                  </div>
                </div>
            
                <a data-collection-id="1037" data-bindattr-1322="1322" data-ember-action="1323" className="">Transportation Emergency Contact Numbers</a>
                <div data-collection-id="1037" data-bindattr-1325="1325" className="">
                  <div className="supporting_material_content">
                    
               
          <h5><b> Emergency Contact Numbers</b></h5>
    <table>
      <tbody><tr>
        <th>Contact</th>
        <th>Number</th>
      </tr>
      <tr>
        <td>POLICE / FIRE / EMS</td>
        <td>911</td>
      </tr>
      <tr>
        <td>Principals Office</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>Transportation Office</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>District Service Center</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>Deputy Superintendent</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 1</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 2</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 3</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 4</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 1</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 2</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 3</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 4</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 5</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Other</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
    </tbody></table>
                  </div>
                </div>
            
                <a data-collection-id="1038" data-bindattr-1327="1327" data-ember-action="1328" className="">Building Personnel Emergency Contact Numbers</a>
                <div data-collection-id="1038" data-bindattr-1330="1330" className="">
                  <div className="supporting_material_content">
                    
                  
          <h5><b> Emergency Contact Numbers</b></h5>
    <table>
      <tbody><tr>
        <th>Contact</th>
        <th>Number</th>
      </tr>
      <tr>
        <td>POLICE / FIRE / EMS</td>
        <td>911</td>
      </tr>
      <tr>
        <td>Principals Office</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>Transportation Office</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>District Service Center</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
      <tr>
        <td>Deputy Superintendent</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 1</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 2</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 3</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Law Enforcement 4</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 1</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 2</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 3</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 4</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Fire Department 5</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
        <tr>
        <td>&nbsp;Other</td>
        <td>xxx-xxx-xxxx</td>
      </tr>
    </tbody></table>
                  </div>
                </div>
            
                <a data-collection-id="1039" data-bindattr-1332="1332" data-ember-action="1333" className="">Supporting Materials</a>
                <div data-collection-id="1039" data-bindattr-1335="1335" className="">
                  <div className="supporting_material_content">
                    <table border="0">
    <tbody>
    <tr><th>Contact</th><th>Number</th></tr>
    <tr>
    <td>POLICE / FIRE / EMS</td>
    <td>911</td>
    </tr>
    <tr>
    <td>Principals Office</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>Transportation Office</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>District Service Center</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>Deputy Superintendent</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Law Enforcement 1</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Law Enforcement 2</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Law Enforcement 3</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Law Enforcement 4</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Fire Department 1</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Fire Department 2</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Fire Department 3</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Fire Department 4</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Fire Department 5</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    <tr>
    <td>&nbsp;Other</td>
    <td>xxx-xxx-xxxx</td>
    </tr>
    </tbody>
    </table>
                  </div>
                </div>
            
                <a data-collection-id="1470" data-bindattr-1337="1337" data-ember-action="1338" className="">Supporting Materials</a>
                <div data-collection-id="1470" data-bindattr-1340="1340" className="">
                  <div className="supporting_material_content">
                    <p>TEst plan</p>
                  </div>
                </div>
            
                <a data-collection-id="1471" data-bindattr-1342="1342" data-ember-action="1343" className="">Supporting Materials</a>
                <div data-collection-id="1471" data-bindattr-1345="1345" className="">
                  <div className="supporting_material_content">
                    
                  </div>
                </div>
            
                <a data-collection-id="1472" data-bindattr-1347="1347" data-ember-action="1348" className="">Supporting Materials</a>
                <div data-collection-id="1472" data-bindattr-1350="1350" className="">
                  <div className="supporting_material_content">
                    
                  </div>
                </div>
            
                <a data-collection-id="1446" data-bindattr-1352="1352" data-ember-action="1353" className="">Supporting Materials</a>
                <div data-collection-id="1446" data-bindattr-1355="1355" className="">
                  <div className="supporting_material_content">
                    
                  </div>
                </div>
            
                <a data-collection-id="1474" data-bindattr-1357="1357" data-ember-action="1358" className="">Supporting Materials</a>
                <div data-collection-id="1474" data-bindattr-1360="1360" className="">
                  <div className="supporting_material_content">
                    
                  </div>
                </div>
            
            </div>
    
          </div>
        </div>
      </div>
    </div>
    </div>
      
      
      <ul className="collections">
      
        
        <li className="messageButtonCell">
          <a id="ember1175" className="ember-view danger intruder" href="/messages/urgent/emergency"><div className="buttonText">Emergency</div></a>
          <a id="ember1176" className="ember-view danger" href="/messages/urgent/shooter"><div className="buttonText">Active Shooter</div></a>
        </li>
        <li className="messageButtonCell">
          <a id="ember1177" className="ember-view" href="/messages/compose"><div className="buttonText">Send Message</div></a>
          <a id="ember1178" className="ember-view" href="/messages"><div className="buttonText">View Messages</div></a>
        </li>
        
      
      
        <li><a id="ember1229" className="ember-view" href="/collections/1036">Emergency Response Plan</a></li>
      
        <li><a id="ember1247" className="ember-view" href="/collections/1037">Transportation Emergency Procedure Guide</a></li>
      
        <li><a id="ember1249" className="ember-view" href="/collections/1038">Building Personnel Procedure Guide</a></li>
      
        <li><a id="ember1251" className="ember-view" href="/collections/1039">Safe Schools</a></li>
      
        <li><a id="ember1253" className="ember-view" href="/collections/1470">Test Plan</a></li>
      
        <li><a id="ember1255" className="ember-view" href="/collections/1471">test plan 2</a></li>
      
        <li><a id="ember1257" className="ember-view" href="/collections/1472">Test 3</a></li>
      
        <li><a id="ember1259" className="ember-view" href="/collections/1446">Abcd</a></li>
      
        <li><a id="ember1261" className="ember-view" href="/collections/1474">kjwdkwjehkjwh</a></li>
      
      </ul>
    
    <div id="welcome">
      <div className="header">
        <div className="content">
        
          <div className="orgLogo-container">
            <img className="orgLogo" src="//mobileemergencyresponseplans.com/uploads/organization/logo/223/Arodek_logo_new.JPG" data-bindattr-398="398"/>
          </div>
        
        </div>
      </div>
      <div className="about">
        <h2>Mobile Emergency Response Plan (M.E.R.P.)</h2>
        <p>The MERP is designed to make your emergency plans and related information portable, immediately accessible, and easily revisable. It is available as both an online and mobile application. It provides your personnel with the tasks to be performed in the critical first moments of an incident. You can also add information to assist in your planning and recovery efforts.</p>
        <p>The MERP comes pre-loaded with content that is based upon best practices identified by emergency services agencies. This information is displayed in a simple task-based format. Simply add text and documents to customize the MERP to further meet the needs of your Organization.</p>
      </div>
      <div className="copyright">
        Copyright © 2018 Safeguard Risk Solutions LLC<br></br><strong>Patent Pending</strong>
      </div>
    </div>
    
    </div>
    
    </div>
    );
  }
}

export default Doc;
