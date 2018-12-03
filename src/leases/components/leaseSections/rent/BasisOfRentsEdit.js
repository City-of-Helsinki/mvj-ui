// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {change} from 'redux-form';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BasisOfRentEdit from './BasisOfRentEdit';
import BoxItemContainer from '$components/content/BoxItemContainer';
import GrayBox from '$components/content/GrayBox';
import GreenBox from '$components/content/GreenBox';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getFieldOptions, isEmptyValue, sortByLabelDesc} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  archived: boolean,
  attributes: Attributes,
  change: Function,
  fields: any,
  isSaveClicked: boolean,
  onArchive?: Function,
  onUnarchive?: Function,
}

type State = {
  areaUnitOptions: Array<Object>,
  attributes: Attributes,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
}

class BasisOfRentsEdit extends PureComponent<Props, State> {
  state = {
    areaUnitOptions: [],
    attributes: {},
    currentLease: {},
    indexOptions: [],
    intendedUseOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.areaUnitOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.area_unit'), false)
        .map((item) => ({...item, label: (!isEmptyValue(item.label) ? item.label.replace('^2', '²') : item.label)}));
      newState.indexOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.index'), false).sort(sortByLabelDesc);
      newState.intendedUseOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.intended_use'));
    }

    return newState;
  }

  handleAdd = () => {
    const {fields} = this.props;
    fields.push({});
  }

  removeBasisOfRent = (index: number) => {
    const {fields} = this.props;
    fields.remove(index);
  }

  render() {
    const {archived, attributes, fields, isSaveClicked, onArchive, onUnarchive} = this.props;
    const {areaUnitOptions, indexOptions, intendedUseOptions} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          if(archived) {
            if(!fields || !fields.length) return null;

            return(
              <div>
                <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
                <GrayBox>
                  <BoxItemContainer>
                    {fields && !!fields.length && fields.map((field, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            fields.remove(index);
                          },
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                          confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                        });
                      };

                      const handleUnarchive = (savedItem: Object) => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            if(onUnarchive) {
                              onUnarchive(index, savedItem);
                            }
                          },
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                          confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                        });
                      };

                      return <BasisOfRentEdit
                        key={index}
                        archived={true}
                        areaUnitOptions={areaUnitOptions}
                        attributes={attributes}
                        field={field}
                        indexOptions={indexOptions}
                        intendedUseOption={intendedUseOptions}
                        isSaveClicked={isSaveClicked}
                        onRemove={handleRemove}
                        onUnarchive={handleUnarchive}
                      />;
                    })}
                  </BoxItemContainer>
                </GrayBox>
              </div>
            );
          }

          return(
            <GreenBox>
              <BoxItemContainer>
                {fields && !!fields.length && fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                      confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                    });
                  };

                  const handleArchive = (savedItem: Object) => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        if(onArchive) {
                          onArchive(index, savedItem);
                        }
                      },
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                      confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                    });
                  };

                  return <BasisOfRentEdit
                    key={index}
                    archived={false}
                    areaUnitOptions={areaUnitOptions}
                    attributes={attributes}
                    field={field}
                    indexOptions={indexOptions}
                    isSaveClicked={isSaveClicked}
                    onArchive={handleArchive}
                    onRemove={handleRemove}
                  />;
                })}
              </BoxItemContainer>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                    label='Lisää vuokralaskuri'
                    onClick={this.handleAdd}
                  />
                </Column>
              </Row>
            </GreenBox>
          );
        }}
      </AppConsumer>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
  {
    change,
  },
  null,
  {
    withRef: true,
  },
)(BasisOfRentsEdit);
