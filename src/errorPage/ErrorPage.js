import React from 'react';
import {Row, Column} from 'react-foundation';
import {translate, Interpolate} from 'react-i18next';
import flowRight from 'lodash/flowRight';

type Props = {
  t: Function,
};

const ErrorPage = ({t}: Props) =>
  <div className="error-page">
    <Row>
      <Column>
        <h1>{t('error')}</h1>
        <Row>
          <Column medium={6} offsetOnMedium={3}>
            <p><Interpolate i18nKey='description' useDangerouslySetInnerHTML={true}/></p>
          </Column>
        </Row>
      </Column>
    </Row>
  </div>;

export default flowRight(
  translate('error')
)(ErrorPage);
