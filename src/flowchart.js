import React, {Component} from 'react';
// import alaSQLSpace from 'alasql';

export default class FlowChart extends Component {
  componentDidMount (){
    const { cards, objCards, chartid } = this.props;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    console.log(flowChartCards, "cards----")
  }
  render(){
    const {closeFlowChartView, title} = this.props;
    console.log(title)
    return (
      <div className='flow-chart-container'>
       <div className='chart-title'>{title}</div>
       <span className='cross-icon-container'><i className="fas fa-times cross-icon" onClick={closeFlowChartView}></i></span> 
      </div>
    )
  }
};