// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';

type Props = {

}

type State = {

}

class PropertySite extends PureComponent<Props, State> {
  state = {
  }

  render (){
    /* 
    const {
      // usersPermissions,
      collapseStateBasic,
    } = this.props;
    */
    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={true}
          headerTitle={'10658/1'}
        >
          <Row>
            <Column large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Kohteen tunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={'10658/1'}
                />
              </FormText>
            </Column>
            <Column large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Vuokraustunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={'TY1234-5'}
                />
              </FormText>
            </Column>
            <Column large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Hitas'}
              </FormTextTitle>
              <FormText>{'Hitas 1'}</FormText>
            </Column>
          </Row>
        </Collapse>
      </Column>
    );
  }
}

export default connect(
  (state) => {
    return {
      // usersPermissions: getUsersPermissions(state),
      // collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_SUMMARY}.${field}.basic`),
    };
  },
  {
    // receiveCollapseStates,
  }
)(PropertySite);
