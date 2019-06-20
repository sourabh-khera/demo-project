import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Organization from './admin/Organization'
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import  alaSQLSpace from 'alasql';
import decode from 'decode-html';
import Base64 from 'base-64'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class ChartsAction extends Component {
    constructor(props){
        super(props);
		this.displayData = [];
		this.displayBeginData = [];
        this.state = {
	   ObjCollection: [],
	   ObjCharts: [],
	   ObjCards:[],
	   ObjBegin:[],
	   showdata : [],
	   showbegindata : [],
	   isLoggedIn: false,
	   begin_chart: 0,
	   render: false
        }
    this.Gotoorg=this.Gotoorg.bind(this);
	this.GotoHelp=this.GotoHelp.bind(this);
	this.GotoHome=this.GotoHome.bind(this);
    this.GotoDoc=this.GotoDoc.bind(this);
    this.GotoProfile=this.GotoProfile.bind(this);
	this.GotoSendMessage=this.GotoSendMessage.bind(this);
	this.GotoViewMessage=this.GotoViewMessage.bind(this);
	this.destinationAction=this.destinationAction.bind(this);
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
    }
	GotoHelp(){
	this.props.history.push('/help');
	}
	
	GotoHome(){
    this.props.history.push('/Collection');
    }
	destinationAction = (card_id,destination) => {
	const query = new URLSearchParams(this.props.location.search);
	const collectionid = query.get('collectionid');
	const chartid = query.get('chartid');
    let safeguard= localStorage.getItem("safeguard");
    let safeguarddata=JSON.parse(safeguard);
	let cards=safeguarddata.cards;
	let actions=safeguarddata.actions;
	let charts=safeguarddata.charts;
	let previous_cardid = 'ember'+card_id;
	document.getElementById("action_area").innerHTML = "";
	let res = alaSQLSpace('SELECT * FROM ? WHERE id = ?', [cards,destination]);
	let res_charts = alaSQLSpace('SELECT * FROM ? WHERE id = ?', [charts,chartid]);
	if(res.length==1)
	{
		let res_action = alaSQLSpace('SELECT * FROM ? WHERE card_id = ?', [actions,res[0].id]);
		this.displayData = [];
		this.displayData.push(<li id={'ember'+res[0].id} className={'ember-view ' + res[0].id + ' ' +res[0].card_type+' activecard'} data-type={res[0].card_type} data-card={res[0].id} data-chart-title={res_charts[0].title}>
		{ ReactHtmlParser(Base64.decode(res[0].content)) }
		<p className="card-content-actions"><button onClick={ ()=>this.destinationAction(res[0].id,res_action[0].destination)}>{res_action[0].content!=''?res_action[0].content:'Next'}</button></p>
		</li>);
	this.setState({
    showdata : this.displayData,
	begin_chart:1
    });	
	}
	
	}
	redirectAction(chartid)
	{
		let safeguard= localStorage.getItem("safeguard");
		let safeguarddata=JSON.parse(safeguard);
		let cards=safeguarddata.cards;
		let charts=safeguarddata.charts;
		let actions=safeguarddata.actions;
		const query = new URLSearchParams(this.props.location.search);
        const collectionid = query.get('collectionid');
		this.props.history.push('/ChartsAction?collectionid='+collectionid+'&chartid='+chartid);
		let res = alaSQLSpace('SELECT cards FROM ? where id = ?', [charts,chartid]);
		this.setState({
		ObjCards:res[0].cards,
		begin_chart:0
		})
		/*window.location.reload();*/
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
  
  componentWillMount(){
  this.getCollectionList();
  this.getChartList();
  this.getCardList();
  this.getBeginArray();
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
  
getCardList(){
const query = new URLSearchParams(this.props.location.search);
const collectionid = query.get('collectionid');
const chartid = query.get('chartid');
let safeguard= localStorage.getItem("safeguard");
let safeguarddata=JSON.parse(safeguard);
let charts=safeguarddata.charts;
let cards=safeguarddata.cards;
let actions=safeguarddata.actions;
let res = alaSQLSpace('SELECT cards FROM ? where id = ?', [charts,chartid]);
this.setState({
ObjCards:res[0].cards
})
}
	
getBeginArray(chartid)
{
let safeguard= localStorage.getItem("safeguard");
    let safeguarddata=JSON.parse(safeguard);
	let cards=safeguarddata.cards;
	let actions=safeguarddata.actions;
	   this.state.ObjCards.map((item,i)=>{						 
	   let res = alaSQLSpace('SELECT * FROM ? WHERE id = ? AND chart_id = ? AND card_type = ?', [cards,item,chartid,'begin']);
	   if(res.length==1)
	   {
		let res_action = alaSQLSpace('SELECT * FROM ? WHERE card_id = ?', [actions,res[0].id]);
		this.displayBeginData = [];
		this.displayBeginData.push(<li id={'ember'+res[0].id} className={'ember-view ' + res[0].id + ' ' +res[0].card_type+' activecard'} data-type={res[0].card_type} data-card={res[0].id} data-chart-title="Incident Management Systemsss">
		{ ReactHtmlParser(Base64.decode(res[0].content)) }
		<p className="card-content-actions"><button onClick={ ()=>this.destinationAction(res[0].id,res_action[0].destination)}>{res_action[0].content!=''?res_action[0].content:'Next'}</button></p>
		</li>);
	   }
    })
	
this.setState({
showbegindata : this.displayBeginData
});		
}
  
    render() {
	console.log(this.state.ObjCards);	
	let safeguard= localStorage.getItem("safeguard");
    let safeguarddata=JSON.parse(safeguard);
	let cards=safeguarddata.cards;
	let actions=safeguarddata.actions;
	let charts=safeguarddata.charts;
	const query = new URLSearchParams(this.props.location.search);
	const collectionid = query.get('collectionid');
	const chartid = query.get('chartid');
	let res_charts = alaSQLSpace('SELECT * FROM ? WHERE id = ?', [charts,chartid]);
	
	   let begin_block = this.state.ObjCards.map((item,i)=>{						 
	   let res = alaSQLSpace('SELECT * FROM ? WHERE id = ? AND chart_id = ? AND card_type = ?', [cards,item,chartid,'begin']);
	   if(res.length==1)
	   {   
		let res_action = alaSQLSpace('SELECT * FROM ? WHERE card_id = ?', [actions,res[0].id]);
		return <li id={'ember'+res[0].id} className={'ember-view ' + res[0].id + ' ' +res[0].card_type+' activecard'} data-type={res[0].card_type} data-card={res[0].id} data-chart-title={res_charts[0].title}>
		{ ReactHtmlParser(Base64.decode(res[0].content)) }
		<p className="card-content-actions"><button onClick={ ()=>this.destinationAction(res[0].id,res_action[0].destination)}>{res_action[0].content!=''?res_action[0].content:'Next'}</button></p>
		</li>
	   }
    })
     
	let chartList = this.state.ObjCharts.map(v => (
	  <li key={v.id}>{v.id===chartid?<a id={v.id} className="ember-view active" onClick={()=>this.redirectAction(v.id)}>{v.title}</a>:<a id={v.id} className="ember-view" onClick={()=>this.redirectAction(v.id)}>{v.title}</a>}</li>
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
          <li className="admin" onClick={this.Gotoorg}><a  >c<span className="text">Admin</span></a></li>
        </ul>
      </div>
      <div id="application">
        <ul className="book charts">
        {chartList}
      </ul>


<div className="chart">
<a className="overview-link">p</a>
<div className="trail"><ul></ul></div>
<ul className="book cards" id="action_area">
{begin_block}
{this.state.showdata}
</ul>

</div>
</div>
</div>
);
} else {
window.location.href = '/';
}	
}
}
export default ChartsAction;