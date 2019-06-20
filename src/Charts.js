import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Organization from './admin/Organization'
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import  alaSQLSpace from 'alasql';
import { Document, Page } from 'react-pdf';
import Pdf from './pdf/Booking.pdf';
import { Preview, print } from 'react-html2pdf';
/*import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';*/
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import MultiPage from "./components/MultiPage";
import PrintButton from "./components/PrintButton";

class Charts extends Component {
       constructor(props){
       super(props);
       this.state = {
	   ObjCollection: [],
	   ObjCharts: [],
	   isLoggedIn: false,
	   render: false,
	   numPages: null,
	   pageNumber: 1
        }
    this.Gotoorg=this.Gotoorg.bind(this);
	this.GotoHelp=this.GotoHelp.bind(this);
	this.GotoHome=this.GotoHome.bind(this);
    this.GotoDoc=this.GotoDoc.bind(this);
    this.GotoProfile=this.GotoProfile.bind(this);
	this.GotoSendMessage=this.GotoSendMessage.bind(this);
	this.GotoViewMessage=this.GotoViewMessage.bind(this);
    }
	
	/*printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
      })
    ;
  }*/
	
	  onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({ numPages });
      }

      getChartList(){
      const query = new URLSearchParams(this.props.location.search);
      const collectionid = query.get('collectionid');
      let safeguard= localStorage.getItem("safeguard");
      let safeguarddata=JSON.parse(safeguard);
      let charts=safeguarddata.charts;
      let res= alaSQLSpace('SELECT * FROM ? where collection = ?', [charts,collectionid]);

      this.setState({
        ObjCharts:res
      })
    }
	
    Gotoorg(){
        this.props.history.push('/Organization');
        //alert("click");
    }
	GotoHelp(){
		this.props.history.push('/help');
	}
	
	GotoHome(){
    this.props.history.push('/Collection');
    }
	redirectAction(chartid)
	{
		const query = new URLSearchParams(this.props.location.search);
        const collectionid = query.get('collectionid');
		this.props.history.push('/ChartsAction?collectionid='+collectionid+'&chartid='+chartid);
	}
	
	GotoDoc(){
		this.props.history.push('/Doc');
  }

  GotoProfile(){
    this.props.history.push('/Profile');
  }
 
 GotoSendMessage()
  {
	  this.props.history.push('compose');
  }
  
  GotoViewMessage()
  {
	this.props.history.push('messages');
	 
  }

    logout() {
      if (window.confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = '/';
    }
  }
  
  componentDidMount(){
  this.getCollectionList();
  this.getChartList();
  }
  getCollectionList()
  {
	  const query = new URLSearchParams(this.props.location.search);
      const collectionid = query.get('collectionid');
      let safeguard= localStorage.getItem("safeguard");
      let safeguarddata=JSON.parse(safeguard);
      let collections=safeguarddata.collections;
      let res = alaSQLSpace('SELECT * FROM ? where id = ?', [collections,collectionid]);
      this.setState({
        ObjCollection:res
      })
  }
  render() {
	const { pageNumber, numPages } = this.state;  
	let chartList = this.state.ObjCharts.map(v => (
	  <li key={v.id}><a id={v.id} className="ember-view" onClick={()=>this.redirectAction(v.id)}>{v.title}</a></li>
    ));
	let supporting_material_title = this.state.ObjCollection.map(v => (
	  <h2>{v.supporting_material_title}</h2>
    ));
	let supporting_material_content = this.state.ObjCollection.map(v => (
	  ReactHtmlParser(v.supporting_material_content)
    ));
if (localStorage.getItem('session')) {	  
 return (
		 
	<div className="ember-view ember-app"><div className="menu">
        <ul>
          <li className="homeicon"><a onClick= {this.GotoHome}>h</a></li>
          <li className="back"><a onClick= {this.GotoHome}>M</a></li>
          <li className="titlebar">Arodek</li>
          <li className="logout"><a onClick= {this.logout}>o<span className="text">Logout</span></a></li>
          <li className="profile" onClick={this.GotoProfile}><a>u<span className="text">Profile</span></a></li>
          <li className="docs" onClick={this.GotoDoc}><a>d<span className="text">Docs</span></a></li>
          <li className="help" onClick={this.GotoHelp}><a>?<span className="text">Help</span></a></li>
          <li className="admin" onClick={this.Gotoorg}><a>c<span className="text">Admin</span></a></li>
        </ul>
      </div>
      <div id="application">
        
        <ul className="book charts">
        {chartList}
        </ul>
        <div className="chart">
          <div className="supporting_material_content">
		  
		  <div className="bg-black-80 w-100 pv5">		
		  <div className="white mt3 tc f3">
		  <PrintButton id={"multiPage"} className="email_pdf_link pdf_link" label={"Print Quality PDF (87.5 MB)"} />
		  <MultiPage id={"multiPage"} />
		  </div>
		  </div>
		  
		  
		  
          {supporting_material_title}
		  {supporting_material_content}
        </div>
		
      </div>
	  
      </div>
      
      </div>
	 
    
    );
} else {
 window.location.href = '/';
}	
  }
}

export default Charts;