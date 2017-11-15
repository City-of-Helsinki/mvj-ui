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

import EditModal from '../../../components-alpha/editModal/editModal';
import LeasesEdit from './LeasesEdit';

import Table from '../../../components-alpha/table/Table';

type Props = Object;
type State = {
  isEditing: boolean,
  activeRent: Object | null,
  activeIndex: number | null,
  rents: Object | null,
}

class Leases extends Component {

  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      activeRent: null,
      activeIndex: null,
      rents: null,
    };
  }

  componentWillMount() {
    const {rents} = this.props;
    this.setState({rents});
  }

  componentWillReceiveProps(nextProps) {
    const {rents} = nextProps;
    this.setState({rents});
  }

  displayEditModal = (activeRent = null, activeIndex = null) => {
    this.setState({
      isEditing: true,
      activeRent,
      activeIndex,
    });
  };

  handleEditSave = (values) => {
    const {array} = this.props;
    const {activeIndex} = this.state;

    array.splice('rents', activeIndex, 1, values);
    this.setState({isEditing: false, activeRent: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleCreateNew = (values) => {
    const {array} = this.props;
    array.push('rents', values);
    this.setState({isEditing: false, activeRent: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activeIndex} = this.state;
    array.remove('rents', activeIndex);
    this.setState({isEditing: false, activeRent: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {rents}} = this.props;
    this.setState({
      isEditing: false,
      activeRent: null,
      activeIndex: null,
      rents,
    }, () => this.props.closeReveal('editModal'));
  };

  render() {
    const {className, t, rents, attributes} = this.props;

    return (
      <Row className={className}>

        <Column medium={12}>
          <h1 className="tab__content--title">{t('leases.title')}</h1>
        </Column>

        {rents && rents.map((rent, i) => (
          <section key={i} className="data-box">
            <div className="data-box__header">
              <h2>{t('single')} {i + 1} <span className="identifier">{t(`leases.types.${get(rent, 'type')}`)}</span>
              </h2>
              <div className="data-box__header--item">
                <span className="identifier">Käyttötarkoitus</span>
                {get(rent, 'use') || ' - '}
              </div>
              <div className="data-box__header--item">
                <span className="identifier">Sopimusvuokra</span>
                {get(rent, 'amount') || ' - '}&euro;/v
              </div>
            </div>

            <div className="data-box__content">
              <div className="data-box__content--section">
                <h3>Alennukset ja korotukset</h3>

                <Table
                  dataKeys={[
                    {key: 'tunnus', label: 'Tunnus'},
                    {key: 'kommentti', label: 'Kommentti'},
                    {key: 'maara', label: 'Määrä'},
                    {key: 'state', label: 'Voimassa'},
                  ]}
                  data={[
                    {
                      id: 1,
                      tunnus: 'Alennus',
                      kommentti: 'ARAVA-alennus',
                      maara: '30%',
                      state: '31.1.2017 - 31.12.2018',
                    },
                  ]}
                />
              </div>

              <div className="data-box__controls">
                <span onClick={() => this.displayEditModal(rent, i)} className="edit">{t('leases.editLease')}</span>
              </div>
            </div>
          </section>
        ))}

        <Column medium={12} className="section__controls">
          <button className="add-new-button" onClick={() => this.displayEditModal()}>{t('leases.addLease')}</button>
        </Column>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
          isOpen={this.state.isEditing}
          component={LeasesEdit}
          handleEdit={this.handleEditSave}
          handleCreate={this.handleCreateNew}
          handleDelete={this.handleDelete}
          handleDismiss={this.handleDismissEditModal}
          attributes={attributes}
          activeRent={this.state.activeRent}
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
)(Leases);
