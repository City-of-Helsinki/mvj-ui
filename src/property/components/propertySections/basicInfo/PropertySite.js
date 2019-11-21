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
          <Row> {/* TODO wrap columns around authorization */}
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>{/* required={false} enableUiDataEdit */}
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
            <Column small={3} medium={2} large={1}>
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
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Hitas'}
              </FormTextTitle>
              <FormText>{'Hitas 1'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Osoite'}
              </FormTextTitle>
              <FormText>{'Verkkosaarenranta'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Kaavayksikön vaihe'}
              </FormTextTitle>
              <FormText>{'Suunniteltu'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Asemakaavan ja käsittelyvaihe'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={'12375'}
                />
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Hakemukset'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={'Hakemukset (25)'}
                />
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Käyttötarkoitus'}
              </FormTextTitle>
              <FormText>{'AK'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Rak. oikeus'}
              </FormTextTitle>
              <FormText>{'3500 k-m2'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Rak. oikeus'}
              </FormTextTitle>
              <FormText>{'12/2022'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Rahoitusmuoto'}
              </FormTextTitle>
              <FormText>{'Vapaarahoitteinen'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Hallintamuoto'}
              </FormTextTitle>
              <FormText>{'Omistus'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Ehdotettu varauksensaaja'}
              </FormTextTitle>
              <FormText>{'Oy Firma Ab'}</FormText>
              <FormText>{'As. Oy Asuntosunto'}</FormText>
              <FormText>{'Puuha Pete'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Osuus'}
              </FormTextTitle>
              <FormText>{'1/1'}</FormText>
              <FormText>{'1/1'}</FormText>
              <FormText>{'1/1'}</FormText>
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
