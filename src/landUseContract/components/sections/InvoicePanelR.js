// @flow
import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';

import Button from '$components/button/Button';
import TablePanelContainer from '$components/table/TablePanelContainer';
import {ButtonColors} from '$components/enums';

type Props = {
}

type State = {
}

class InvoicePanelR extends PureComponent<Props, State> {
  component: any

  state = {}

  render() {
    return(
      <TablePanelContainer
        footer={<Fragment>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={()=>{}}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={true}
            onClick={()=>{}}
            text='Tallenna'
          />
        </Fragment>
        }
        onClose={()=>{}}
        title='Laskun tiedot'
      >
        {''}
      </TablePanelContainer>
    );
  }
}

export default connect(
  () => {
    return {
    };
  }
)(InvoicePanelR);
