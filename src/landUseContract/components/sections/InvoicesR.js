// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import {AppConsumer} from '$src/app/AppContext';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
// import CreateAndCreditInvoiceR from './CreateAndCreditInvoiceR';
import Divider from '$components/content/Divider';
import InvoiceTableAndPanelR from './InvoiceTableAndPanelR';
import WarningField from '$components/form/WarningField';
import Title from '$components/content/Title';
import WarningContainer from '$components/content/WarningContainer';
import {ButtonColors} from '$components/enums';

type Props = { }

type State = {
  invoiceNotes: Array<Object>,
}

class InvoicesR extends PureComponent<Props, State> {

  componentDidMount = () => {
  }

  render() {

    return (
      <AppConsumer>
        {() => {

          return(
            <Fragment>
              <Title>
                {'Laskut'}
              </Title>
              <WarningContainer
                alignCenter
                buttonComponent={
                  <Button className={ButtonColors.NEUTRAL} onClick={()=>{}} text='Käynnistä laskutus' />}
              >
                <WarningField
                  meta={{warning: 'Tiedot keskeneräiset'}}
                  showWarning={true}
                />
              </WarningContainer>
              <Divider />

              <Collapse
                defaultOpen={true}
                headerTitle={'Laskut'}
              >
                <InvoiceTableAndPanelR/>
                {/* <CreateAndCreditInvoiceR/> */}
              </Collapse>

            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
  ),
)(InvoicesR);
