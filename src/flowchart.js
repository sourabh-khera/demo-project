import React, {Component, Fragment} from 'react';
import ReactHtmlParser from 'react-html-parser';
// import alaSQLSpace from 'alasql';

export default class FlowChart extends Component {
  constructor(){
    super();
    this.state={flowChartCards: [] };
}
  componentDidMount (){
    const { cards, objCards, chartid, actions, charts } = this.props;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    this.setState({flowChartCards});
    console.log(flowChartCards, "cards----");
  }
  render(){
    const {closeFlowChartView, title} = this.props;
    console.log(title)
    return (
      <div className='flow-chart-container'>
      <div className="heading-container">
      <div className='chart-title'>{title}</div>
       <span className='cross-icon-container'><i className="fas fa-times cross-icon" onClick={closeFlowChartView}></i></span> 
      </div>  
       <div className='overlay-container'>
         <div className='overview-scroller'>
           <div className='overview'>
           <ul className='cards'>
          {
            this.state.flowChartCards.map((item, idx) =>(<li className='column' key={idx}>
              <ul>
                <li className={item.card_type}>
                   <style dangerouslySetInnerHTML={{ __html: [ `.${item.card_type}:before {content: ${item.card_type}} `].join('\n') }}></style>
                  <div className='content'>
                    {ReactHtmlParser("<p><strong>Discoverer notifies:</strong></p>\n\n<p>Principal or Main Office</p>\n\n<p>or</p>\n\n<p>Calls 911</p>\n\n<p>or</p>\n\n<p>Uses emergency pull station</p>\n")}
                  </div>
                </li>

              </ul>
              
              
              </li>))
          } 
        </ul>
           </div>

         </div>
       </div>
      </div>
    )
  }
};