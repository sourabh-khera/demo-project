import React, { Component } from 'react';
import Page from './Page';
import alaSQLSpace from 'alasql';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import decode from 'decode-html';
import Base64 from 'base-64';
import { Preview, print } from 'react-html2pdf';
/*import './pdf_style.css';*/
let myComponents;
if (localStorage.getItem('session')) {
      let safeguard= localStorage.getItem("safeguard");
      let safeguarddata=JSON.parse(safeguard);
      let collections=safeguarddata.collections;
	  let collectionid = '1036';
      let res = alaSQLSpace('SELECT * FROM ? where id = ?', [collections,collectionid]);
	  let res_count = res.length;
	  
	  if(res_count>0)
	  {
		  myComponents = [res[0]];
	  }
}else{
	myComponents = [];
}
	  
	  
	  let supporting_material_title = myComponents.map(v => (
	  <h2>{v.supporting_material_title}</h2>
    ));
	let supporting_material_content = myComponents.map(v => (
	v.supporting_material_content
    )); 

const MultiPage = ({id}) => (
<Page id={id}>
{supporting_material_title}
{ReactHtmlParser(supporting_material_content)}
</Page>
);

export default MultiPage;