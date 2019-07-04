import React, { Component, Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Base64 from 'base-64'

export default class FlowCard extends Component {
  constructor() {
    super();
    this.state = { flowChartCards: [], activeCardIndex: 0, newFlowCards: [] };
  }
 
  handleNextButton = () => {
    const { activeCardIndex, newFlowCards, flowChartCards } = this.state;
    this.setState({newFlowCards: [...newFlowCards, flowChartCards[activeCardIndex + 1]], activeCardIndex: activeCardIndex + 1});
  }
  
  componentDidMount() {
    const { cards, chartid, actions, charts } = this.props;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    flowChartCards.map((item, idx) => {
      let flowChartActions = [];
      item.actions.map((actionItem, idx) => {
        flowChartActions.push(actions.filter(item => item.id === actionItem)[0]);
      });
      item.actions = flowChartActions;
    });
    this.setState({newFlowCards: [flowChartCards[this.state.activeCardIndex]]}, ()=>{console.log(this.state.newFlowCards)}); 
    this.setState({ flowChartCards });
  }

  componentWillReceiveProps(nextProps) {
    const { cards, chartid, actions, charts } = nextProps;
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    flowChartCards.map((item, idx) => {
      let flowChartActions = [];
      item.actions.map((actionItem, idx) => {
        flowChartActions.push(actions.filter(item => item.id === actionItem)[0]);
      });
      item.actions = flowChartActions;
    });
    this.setState({newFlowCards: [flowChartCards[this.state.activeCardIndex]]}, ()=>{console.log(this.state.newFlowCards)}); 
    this.setState({ flowChartCards });

  }

  render() {
    const { newFlowCards, activeCardIndex } = this.state;
    const activeCardContent = newFlowCards && newFlowCards.length ? newFlowCards[activeCardIndex] : null;
    const { title } = this.props;
    const renderCardItem = activeCardContent ? (
      <li className={`${activeCardContent.card_type} activecard`} data-type={activeCardContent.card_type} data-card={activeCardContent.id} data-chart-title={title}>
      {ReactHtmlParser(Base64.decode(activeCardContent.content))}
    <p className="card-content-actions">{
      activeCardContent.actions[0].content == '' ? 
      <button onClick={this.handleNextButton}>Next</button>
      : null
    }</p>
    </li>
    ) : null;
    return (
      <Fragment>
        {renderCardItem}
      </Fragment>
    );
  }
};