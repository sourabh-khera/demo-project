import React, {Component, Fragment} from 'react';
import ReactHtmlParser from 'react-html-parser';

export default class FlowChart extends Component {
  constructor(){
    super();
    this.state={flowChartCards: [], totalArrows: [] };
}
  componentDidMount (){
    const { cards, objCards, chartid, actions, charts } = this.props;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    const totalArrows = [];
    flowChartCards.forEach((item, idx) => {
        if(item.card_type !== 'begin' && item.card_type !== 'end') {
           totalArrows.push({ key: idx, card_type: item.card_type });
        }
    });
    totalArrows.pop();

    flowChartCards.map((item, idx) => {
      let flowChartActions = [];
      item.actions.map((actionItem, idx) => {
        flowChartActions.push(actions.filter(item => item.id === actionItem)[0]);
      });
      item.actions = flowChartActions;
    });
    this.setState({flowChartCards, totalArrows}, ()=>{console.log(this.state.flowChartCards)});
  }

  componentDidUpdate() {
      const { totalArrows } = this.state;
      if(totalArrows && !totalArrows[0].height) {
          const _totalArrows = totalArrows.map(item => {
              return { ...item, height: this[`wrapperRef${item.key}`].clientHeight/3 - 8}
          });
          this.setState({ totalArrows: _totalArrows });
      }
  }

  render(){
    const {closeFlowChartView, title} = this.props;
    const { flowChartCards, totalArrows } = this.state;
    let showIn = false;
    let showOut = false;
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
                    flowChartCards.map((item, idx) =>(
                        <li className='column' key={idx}>
                          <ul
                              ref={node => (item.card_type !== 'begin' && item.card_type !== 'end') ? this[`wrapperRef${idx}`] = node : null }
                          >
                            <li className={item.card_type} data-type={item.card_type}>
                              <div className='content'>
                                {ReactHtmlParser(window.atob(item.content))}
                              </div>
                                {   item.card_type !== 'notify' || showIn ?
                                    <div className="nub left in">
                                        <div className="node" />
                                    </div> : item.card_type === 'notify' ? showIn = true : null
                                }
                                {   item.card_type !== 'closure' || showOut ?

                                    <div className="nub right out">
                                        <div className="node" />
                                    </div> : item.card_type === 'notify' ? showOut = true : null
                                }
                            </li>
                          </ul>
                      </li>
                    ))
                  }
                </ul>
               {totalArrows.map((item, idx) => (
                   <div
                       key={idx}
                       className="nub-lines"
                       style={{
                           position: "absolute",
                           left: `${201.5+(150*idx)}px`,
                           top: "48px",
                           width: "4px",
                           height: `${item.height}px`
                       }}
                   />
                ))}
           </div>

         </div>
       </div>
      </div>
    )
  }
};