import React, { Component, Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Base64 from 'base-64'

export default class FlowCard extends Component {
  state = { flowChartCards: [], activeCardIndex: 0, newFlowCards: [] };

  componentDidMount() {
      const { cards, chartid, actions } = this.props;
      this.initialState(cards, chartid, actions);
  }

  componentWillReceiveProps(nextProps) {
    const { cards, chartid, actions } = nextProps;
    if(this.props.chartid !== chartid) {
    this.initialState(cards, chartid, actions);
    this.props.resetBreadcrumb();
    }
  }

  initialState = (cards, chartid, actions) => {
    const flowChartCards = cards.filter(item => item.chart_id === chartid);
    let beginIndex;
    flowChartCards.map((item, idx) => {
      let flowChartActions = [];
      item.actions.map((actionItem) => {
        flowChartActions.push(actions.filter(item => item.id === actionItem)[0]);
      });
      item.actions = flowChartActions;
      if(item.card_type === 'begin')
        beginIndex = idx;
      });
      const temp = flowChartCards.splice(beginIndex, 1);
      flowChartCards.splice(0, 0, temp[0]);
      this.setState({ flowChartCards, newFlowCards: [flowChartCards[0]], activeCardIndex: 0 });
  };

  handleNextButton = actionSelected => {
    const { activeCardIndex, newFlowCards, flowChartCards } = this.state;
    const actionIndex = flowChartCards.findIndex(item => item.id === actionSelected.destination);
    this.setState({newFlowCards: [...newFlowCards, flowChartCards[actionIndex]], activeCardIndex: activeCardIndex + 1});
  };

  handlePrevButton = () => {
    const { activeCardIndex, newFlowCards, flowChartCards } = this.state;
    this.setState({
        newFlowCards: newFlowCards.filter((itm, idx) => idx !== newFlowCards.length-1),
        activeCardIndex: activeCardIndex - 1
    });
  };

  render() {
    const { newFlowCards, activeCardIndex } = this.state;
    const { addBreadcrumb } = this.props;
    const activeCardContent = newFlowCards && newFlowCards.length ? newFlowCards[activeCardIndex] : null;
    const { title } = this.props;
    const renderCardItem = activeCardContent ? (
        <Fragment>
            { (activeCardIndex >= 1) && <a className="backbutton" onClick={ this.handlePrevButton }/> }
            <li className={`${activeCardContent.card_type} activecard`} data-type={activeCardContent.card_type} data-card={activeCardContent.id} data-chart-title={title}>
                {ReactHtmlParser(Base64.decode(activeCardContent.content))}
                <p className="card-content-actions">{
                    activeCardContent.actions.length ? activeCardContent.actions.map(item => (
                            <button onClick={() => {
                                this.handleNextButton(item);
                                addBreadcrumb(activeCardContent);
                            }}>
                                { (item.content == '' || item.content == 'test') ? 'Next' : item.content}</button>
                        ))
                        : <Fragment>
                            <button onClick={() => {}}>Save As Incident Report</button>
                            <button onClick={() => {}}>Save As drill Log</button>
                        </Fragment>
                }</p>
            </li>
        </Fragment>
    ) : null;
    return (
      <Fragment>
        {renderCardItem}
      </Fragment>
    );
  }
};