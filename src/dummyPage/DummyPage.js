// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';

type Props = {
  t: Function
};

class DummyPage extends Component {
  props: Props;

  render() {
    const {t} = this.props;
    return (
      <div style={{margin: 'auto'}}>
        <Row>
          <Column>
            <h1>{t('dummyPage')}</h1>
          </Column>
        </Row>
      </div>
    );
  }
}

export default flowRight(translate(['common', 'login']))(DummyPage);

