import React, {Component, Fragment} from 'react';
import ReactHtmlParser from 'react-html-parser';

export default class FlowChart extends Component {
  constructor(){
    super();
    this.state={flowChartCards: [] };
}
  componentDidMount (){
    const { cards, objCards, chartid, actions, charts } = this.props;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    this.setState({flowChartCards});
  }
  render(){
    const {closeFlowChartView, title} = this.props;
    const { flowChartCards } = this.state;
    return (
      <div className='flow-chart-container'>
      <div className="heading-container">
      <div className='chart-title'>{title}</div>
       <span className='cross-icon-container'><i className="fas fa-times cross-icon" onClick={closeFlowChartView} /></span>
      </div>  
       <div className='overlay-container'>
         <div className='overview-scroller'>
           <div className='overview'>
           <ul className='cards'>
          {
            flowChartCards.map((item, idx) =>(<li className='column' key={idx}>
              <ul>
                <li className={item.card_type} data-type={item.card_type}>
                  <div className='content'>
                    {ReactHtmlParser(window.atob(item.content))}
                  </div>
                </li>
              </ul>
              </li>
            ))
          }
        </ul>
           </div>

         </div>
       </div>
      </div>
    )
  }
};