import React, { Component } from 'react';
import Page from './Page';
import  alaSQLSpace from 'alasql';

const MultiPage = ({id}) => (<Page id={id}>
							 
	  const query = new URLSearchParams(this.props.location.search);
      const collectionid = query.get('collectionid');
      let safeguard= localStorage.getItem("safeguard");
      let safeguarddata=JSON.parse(safeguard);
      let collections=safeguarddata.collections;
	  let collectionid = 1036;
      let res_collection = alaSQLSpace('SELECT * FROM ? where id = ?', [collections,collectionid]);	
	  
	  let supporting_material_title = this.state.ObjCollection.map(v => (
	  <h2>{v.supporting_material_title}</h2>
    ));
	let supporting_material_content = this.state.ObjCollection.map(v => (
	  ReactHtmlParser(v.supporting_material_content)
    ));
	
	alert(supporting_material_title);
	
	{supporting_material_title}
</Page>);

export default MultiPage;