// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import GroupTitle from '../../components-alpha/form/GroupTitle';
import FormField from '../../components-alpha/form/FormField';
import FieldTypeMulti from '../../components-alpha/form/FieldTypeMulti';
import {BaseValidator} from '../../components-alpha/form/validation';
import {getCurrentApplication} from '../selectors';
import {fetchSingleApplication} from '../actions';
import {formatDateObj} from '$util/helpers';
import {getAttributes} from '../../attributes/selectors';
import FormActions from '../../leases-alpha/components/formSections/FormActions';
import {getUser} from '../../role/selectors';
import {createLease} from '../../leases-alpha/actions';
import NewLeaseTemplate from '../../leases-alpha/components/NewLeaseTemplate';

type Props = {
  application: Object,
  applicationId: Number,
  attributes: Object,
  createLease: Function,
  fetchSingleApplication: Function,
  handleSave: Function,
  handleSubmit: Function,
  invalid: Boolean,
  isOpenApplication: Boolean,
  pristine: Boolean,
  submitSucceeded: Boolean,
  submitting: Boolean,
  t: Function,
  user: Object,
};

const validate = ({organization, organization_id, name, email, phone, contact_name, contact_email, contact_phone}) => {
  const customConditions = {};
  return BaseValidator({
    organization, organization_id, name, email, phone, contact_name, contact_email, contact_phone,
  }, customConditions);
};

class ApplicationEdit extends Component<Props> {
  componentWillMount() {
    const {application: {id}, fetchSingleApplication, applicationId} = this.props;

    if (id !== applicationId) {
      fetchSingleApplication(applicationId);
    }
  }

  createLease = () => {
    const {application, user, createLease} = this.props;
    const lease = NewLeaseTemplate({
      preparer: user,
      application,
    });
    return createLease(lease);
  };

  render() {

    const {
      application,
      attributes,
      handleSave,
      handleSubmit,
      invalid,
      pristine,
      submitting,
      t,
    } = this.props;

    const typeOptions = attributes.type.choices.map(({value}) => ({
      value,
      label: t(`types.${value}`),
    }));

    const reasonOptions = attributes.lease_short_term_reason.choices.map(({value}) => ({
      value,
      label: t(`types.${value}`),
    }));

    const fields = {
      application: [
        {name: 'type', type: 'select', label: 'Tyyppi', required: true, cols: 6, options: typeOptions},
        {name: 'reasons', type: 'textarea', label: 'Perustelut', required: false, cols: 6},
        {name: 'land_id', type: 'text', label: 'ID', required: false, cols: 3},
        {name: 'land_address', type: 'text', label: 'Osoite', required: false, cols: 3},
        {name: 'land_map_link', type: 'text', label: 'Karttalinkki', required: false, cols: 3},
        {name: 'land_area', type: 'text', label: 'Ala (km2)', required: false, cols: 3},
      ],

      lease: [
        {name: 'lease_start_date', type: 'text', label: 'Alkaa', required: false, cols: 6},
        {name: 'lease_end_date', type: 'text', label: 'Loppuu', required: false, cols: 6},
        {
          name: 'lease_is_reservation',
          type: 'checkbox',
          label: 'Varaus',
          required: false,
          cols: 4,
          options: [true],
        },
        {
          name: 'lease_is_short_term',
          type: 'checkbox',
          label: 'Varaus on lyhytaikainen',
          required: false,
          cols: 4,
          options: [true],
        },
        {
          name: 'lease_is_long_term',
          type: 'checkbox',
          label: 'Varaus on pitkäaikainen',
          required: false,
          cols: 4,
          options: [true],
        },
        {
          name: 'lease_short_term_reason',
          type: 'select',
          label: 'Syy lyhytaikaisuuteen',
          required: false,
          cols: 12,
          options: reasonOptions,
        },
      ],
      contact: [
        {name: 'contact_name', type: 'text', label: 'Nimi', required: true},
        {name: 'contact_email', type: 'text', label: 'Sähköpostiosoite', required: true},
        {name: 'contact_phone', type: 'text', label: 'Puhelin', required: true},
        {name: 'contact_address', type: 'textarea', label: 'Osoite', required: false, cols: 6},
        {name: 'contact_billing_address', type: 'textarea', label: 'Laskutusosoite', required: false, cols: 6},
        {
          name: 'contact_electronic_billing',
          type: 'text',
          label: 'Sähköinen laskutusosoite',
          required: false,
          cols: 12,
        },
      ],
      organization: [
        {name: 'organization_name', type: 'text', label: 'Yritys', required: false, cols: 4},
        {name: 'organization_id', type: 'text', label: 'Y-tunnus', required: false, cols: 4},
        {name: 'organization_revenue', type: 'text', label: 'Liikevaihto', required: false, cols: 4},
        {name: 'organization_address', type: 'textarea', label: 'Osoite', required: false, cols: 12},
      ],
    };

    return (
      <form className="mvj-form" onSubmit={handleSubmit(handleSave)}>
        <div className="edit-modal__content">
          <h1>{formatDateObj(application.updated_at)}</h1>

          <Row className="edit-modal__section">
            <GroupTitle text="Hakemus"/>
            {fields.application.map(({name, type, label, required, cols, ...rest}: Object, i) => (
              <Column key={i} medium={cols || 4}>
                <Field
                  label={label}
                  name={name}
                  required={required}
                  type={type}
                  {...rest}
                  component={FormField}
                />
              </Column>
            ))}
          </Row>

          <Row className="edit-modal__section">
            <GroupTitle text="Rakennettavat alat"/>
            <Column medium={12}>
              <FieldArray name="building_footprints"
                title="Rakennettavat alat"
                fieldValues={[
                  {name: 'use', label: 'Käyttötarkoitus', type: 'text', required: true},
                  {name: 'area', label: 'Neliömäärä', type: 'number', required: true},
                ]}
                component={FieldTypeMulti}/>
            </Column>
          </Row>

          <Row className="edit-modal__section">
            <GroupTitle text="Vuokra"/>
            {fields.lease.map(({name, type, label, required, cols, ...rest}: Object, i) => (
              <Column key={i} medium={cols || 4}>
                <Field
                  label={label}
                  name={name}
                  required={required}
                  type={type}
                  {...rest}
                  component={FormField}
                />
              </Column>
            ))}
          </Row>

          <Row className="edit-modal__section">
            <GroupTitle text="Yhteystiedot"/>
            {fields.contact.map(({name, type, label, required, cols, ...rest}: Object, i) => (
              <Column key={i} medium={cols || 4}>
                <Field
                  label={label}
                  name={name}
                  required={required}
                  type={type}
                  {...rest}
                  component={FormField}
                />
              </Column>
            ))}
          </Row>

          <Row className="edit-modal__section">
            <GroupTitle text="Yritystiedot"/>
            {fields.organization.map(({name, type, label, required, cols}, i) => (
              <Column key={i} medium={cols || 4}>
                <Field
                  label={label}
                  name={name}
                  required={required}
                  type={type}
                  component={FormField}
                />
              </Column>
            ))}
          </Row>


          <FormActions className="edit-modal__section edit-modal__actions"
            label="Tallenna muutokset"
            invalid={invalid}
            submitting={submitting}
            pristine={pristine}
            displayCreateButton={true}
            createLabel={t('add')}
            onCreateClick={this.createLease}
          />

        </div>
      </form>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        user: getUser(state),
        application: getCurrentApplication(state),
        attributes: getAttributes(state),
        initialValues: getCurrentApplication(state),
      };
    },
    {
      fetchSingleApplication,
      createLease,
    },
  ),
  reduxForm({
    form: 'application-edit-form',
    validate,
    enableReinitialize: true,
    destroyOnUnmount: true,
  }),
  translate(['common', 'applications']),
)(ApplicationEdit);
