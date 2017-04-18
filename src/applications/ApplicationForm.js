// @flow
import React, {createElement, Component, PropTypes} from 'react';
import {translate} from 'react-i18next';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import find from 'lodash/find';
// import classNames from 'classnames';

import {getActiveLanguage} from '../helpers';
import Tabs from '../components/tabs/Tabs';

const tab1Content = () => <p>Tab 1 content</p>;
const tab2Content = () => <p>Tab 2 content</p>;
const tab3Content = () => <p>Tab 3 content</p>;
const tab4Content = () => <p>Tab 4 content</p>;

const tabs = [
  {id: 'first', label: 'Tab 1', component: tab1Content},
  {id: 'second', label: 'Tab 2', component: tab2Content},
  {id: 'third', label: 'Tab 3', component: tab3Content},
  {id: 'fourth', label: 'Tab 4', component: tab4Content},
];

type Props = {
  applicationId: string,
  location: Object,
  t: Function,
};

type State = {
  activeTab: string,
};

const getActiveTab = (id: string): Object => find(tabs, {id});

class ApplicationForm extends Component {
  props: Props;
  state: State;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: tabs[0].id,
    };
  }

  componentWillMount() {
    const {location} = this.props;
    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }
  }

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;
    this.setState({activeTab: tabId}, () => {
      return router.push({
        ...location,
        query: {tab: tabId},
      });
    });
  };

  renderTabContent = (): Object => {
    const {activeTab} = this.state;
    const tab = getActiveTab(activeTab);

    return createElement(tab.component, {});
  };

  // Just for demo...
  goBack = () => {
    const {router} = this.context;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications`,
    });
  };

  render() {
    const {activeTab} = this.state;
    const {t, applicationId} = this.props;

    return (
      <div className="applications__form">
        <header className="hero">
          <h2 onClick={() => this.goBack()}>{t('single')} {applicationId}</h2>

          <Tabs
            active={activeTab}
            className="hero__navigation"
            items={tabs}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </header>

        <div className="tab-content">
          {this.renderTabContent()}
        </div>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  translate(['applications'])
)(ApplicationForm);
