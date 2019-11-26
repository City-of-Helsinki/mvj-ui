// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import TitleH3 from '$components/content/TitleH3';
import WhiteBox from '$components/content/WhiteBox';
import FileDownloadButton from '$components/file/FileDownloadButton';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {ApplicationFieldPaths, ApplicationFieldTitles} from '$src/property/enums';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {FormNames, ViewModes} from '$src/enums';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
} from '$src/property/actions';
import {
  getCollapseStateByKey,
} from '$src/property/selectors';

type Props = {
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  formName: string,
}

type State = {

}

class ApplicationEdit extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  render (){
    const {
      collapseStateBasic,
    } = this.props;
  
    return (
      <form>
        <Title uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION)}>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'> {/* TODO wrap columns around authorization */}
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={false} // {isSaveClicked && !isEmpty(errors)} // TODO
              headerTitle={ApplicationFieldTitles.APPLICATION_BASE}
              onToggle={this.handleBasicInfoCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION_BASE)}
            >
              <Row>
                <Column large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Hakutyyppi',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`default`}
                    overrideValues={{
                      fieldType: 'checkbox',
                      label: ApplicationFieldTitles.APPLICATION_DEFAULT,
                    }}
                    enableUiDataEdit
                  />
                </Column>
                <Column large={4}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Lomakkeen lisäosat',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`extra`}
                    overrideValues={{
                      fieldType: 'choice',
                      label: ApplicationFieldTitles.APPLICATION_EXTRA,
                      options: [{value: 1, label: 'one'}, {value: 2, label: 'two'}],
                    }}
                    enableUiDataEdit
                  />
                </Column>
              </Row>
              <Row>
                <Column large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Aiemmin luotu lomake',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`previous`}
                    overrideValues={{
                      fieldType: 'checkbox',
                      label: ApplicationFieldTitles.APPLICATION_PREVIOUS,
                    }}
                    enableUiDataEdit
                  />
                </Column>
                <Column large={4}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Lomakkeen lisäosat',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`created`}
                    overrideValues={{
                      fieldType: 'choice',
                      label: ApplicationFieldTitles.APPLICATION_CREATED,
                      options: [{value: 1, label: 'one'}, {value: 2, label: 'two'}],
                    }}
                    enableUiDataEdit
                  />
                </Column>
              </Row>
              <Column className={''} style={{margin: '0 0 10px 0'}}>
                <FileDownloadButton
                  disabled={false}
                  label='ESIKATSELE'
                  payload={{
                  }}
                  url={''} 
                />
              </Column>
              <WhiteBox className='application__white-stripes'> {/* TODO  : make stripes */}
                <TitleH3>
                  {'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}
                </TitleH3>
              </WhiteBox>
              
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PROPERTY_SUMMARY;
// const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_SUMMARY}.basic`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(ApplicationEdit);
