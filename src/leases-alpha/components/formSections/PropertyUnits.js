// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {reduxForm, getFormInitialValues} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {revealContext} from '../../../foundation/reveal';
import {Sizes} from '../../../foundation/enums';

import {ktjDataSets} from '../../../constants';


import GroupTitle from '../../../components-alpha/form/GroupTitle';
import Table from '../../../components-alpha/table/Table';

import EditModal from '../../../components-alpha/editModal/editModal';
import PropertyUnitEdit from './PropertyUnitEdits';
import {getKtjLink} from '$util/helpers';

type Props = Object;

type State = {
  isEditing: boolean,
  activePropertyUnit: Object | null,
  activeIndex: number | null,
  real_property_units: Array<any> | null,
}

class RealProperyUnits extends Component<Props, State> {
  state = {
    isEditing: false,
    activePropertyUnit: null,
    activeIndex: null,
    real_property_units: null,
  };

  componentWillMount() {
    const {real_property_units} = this.props;
    this.setState({real_property_units});
  }

  componentWillReceiveProps(nextProps) {
    const {real_property_units} = nextProps;
    this.setState({real_property_units});
  }

  displayEditModal = (activePropertyUnit = null, activeIndex = null) => {
    this.setState({
      isEditing: true,
      activePropertyUnit,
      activeIndex,
    });
  };

  handleEditSave = (values) => {
    const {array} = this.props;
    const {activeIndex} = this.state;

    array.splice('real_property_units', activeIndex, 1, values);
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };


  handleCreateNew = (values) => {
    const {array} = this.props;
    array.push('real_property_units', values);
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activeIndex} = this.state;
    array.remove('real_property_units', activeIndex);
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {real_property_units}} = this.props;
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      activeIndex: null,
      real_property_units,
    }, () => this.props.closeReveal('editModal'));
  };

  render() {
    const {className} = this.props;
    const {real_property_units} = this.state;

    return (

      <Row className={className}>
        <Column medium={12}>
          <h1 className="tab__content--title">Kiinteistöt</h1>
        </Column>

        {real_property_units && real_property_units.map((property, i) => (
          <section key={i} className="data-box">
            <div className="data-box__header">
              <h2>{get(property, 'identification_number') || ' - '} <span
                className="identifier">{get(property, 'name') || ' - '}</span></h2>
              <div className="data-box__header--item">
                <span className="identifier">Rekisteröity</span>
                {get(property, 'registry_date') || ' - '}
              </div>
              <div className="data-box__header--item">
                <span className="identifier">Pinta-ala</span>
                {get(property, 'area')}m<sup>2</sup>
              </div>
            </div>

            <div className="data-box__content">
              <div className="data-box__content--section">
                <h3>Tonttijako</h3>

                <Table
                  dataKeys={[
                    {key: 'tunnus', label: 'Tunnus'},
                    {key: 'laji', label: 'Laji'},
                    {key: 'approved', label: 'Hyväksytty'},
                    {key: 'state', label: 'Vaihe'},
                  ]}
                  data={[
                    {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
                  ]}
                />
              </div>

              <div className="data-box__content--section">
                <h3>Asemakaava</h3>

                <Table
                  dataKeys={[
                    {key: 'tunnus', label: 'Tunnus'},
                    {key: 'laji', label: 'Laji'},
                    {key: 'approved', label: 'Hyväksytty'},
                    {key: 'state', label: 'Vaihe'},
                  ]}
                  data={[
                    {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
                  ]}
                />
              </div>

              <GroupTitle text="KTJ-dokumentit"/>

              <Column medium={12}>
                {get(property, 'identification_number') &&
                <ul className="bordered__list">
                  {ktjDataSets.map(({key, label}, i) => (
                    <li key={i}>{label}
                      <div className="links">
                        <a href={getKtjLink(get(property, 'identification_number'), key)} target="_blank">fi</a>
                        <a href={getKtjLink(get(property, 'identification_number'), key, 'sv')} target="_blank">se</a>
                      </div>
                    </li>
                  ))}
                </ul>
                }
              </Column>

              <div className="data-box__controls">
                <span onClick={() => this.displayEditModal(property, i)} className="edit">Muokkaa</span>
              </div>
            </div>
          </section>
        ))}

        <Row className="section__controls">
          <Column medium={12}>
            <button className="add-new-button" onClick={() => this.displayEditModal()}>Lisää kiinteistö</button>
          </Column>
        </Row>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
          isOpen={this.state.isEditing}
          component={PropertyUnitEdit}
          handleEdit={this.handleEditSave}
          handleCreate={this.handleCreateNew}
          handleDelete={this.handleDelete}
          handleDismiss={this.handleDismissEditModal}
          activePropertyUnit={this.state.activePropertyUnit}
        />
        }
      </Row>

    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues('preparer-form')(state),
      };
    },
  ),
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
  }),
  translate(['leases']),
  revealContext(),
)(RealProperyUnits);
