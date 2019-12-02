// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import RemoveButton from '$components/form/RemoveButton';
// import {UsersPermissions} from '$src/usersPermissions/enums';
// import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import SubTitle from '$components/content/SubTitle';

// import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  // leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const TargetEdit = ({
  disabled,
  field,
  //  isSaveClicked,
  //  leaseAttributes,
  onRemove,
  //  usersPermissions,
}: Props) => {

  return (
    <Fragment>
      <Row>
        <Column large={11} style={{marginTop: 15}}>
          <SubTitle>
            {'HAETTAVA KOHDE'}
          </SubTitle>
        </Column>
        <Column large={1}>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista kohde'
              />
            }
          </Authorization>
        </Column>
      </Row>
      <Row>
        {/* 
        Onko aiemmin saanut tonttia kaupungin haussa?
        Ei
        Kyllä, vuonna
        Lisää vuosi
        */}
      </Row>
      <Row>
        <Column large={3}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Tontti, jota hakemus koskee',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.target_property`}
            overrideValues={{
              fieldType: 'choice',
              label: 'Tontti, jota hakemus koskee',
              options: [{value: '1', label: 'Mäntylä'}, {value: '2', label: 'Kuusamo'}],
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={1}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: '%-perusteinen',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.percentage`}
            overrideValues={{
              label: '%-perusteinen',
            }}
            enableUiDataEdit
          />
        </Column>
        <FormText style={{marginTop: 15}}>€/k-m2</FormText>
      </Row>
      <Row>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hankkeen pääsuunnittelija',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.head_planner`}
            overrideValues={{
              label: 'Hankkeen pääsuunnittelija',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hannkeen arvioitu aikataulu',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.head_planner`}
            overrideValues={{
              label: 'Hannkeen arvioitu aikataulu',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hankkeen toivottu laajuus (rakennusoikeus ja asuntojen lkm)',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.head_planner`}
            overrideValues={{
              label: 'Hankkeen toivottu laajuus (rakennusoikeus ja asuntojen lkm)',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <Row>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Rahoitus- ja hallintamuoto',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.funding`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Rahoitus- ja hallintamuoto',
              options: [
                {value: 1, label: 'Sääntelemätön omistus'}, 
                {value: 2, label: 'Hitas omistus'},
                {value: 3, label: 'Hintakontrolloitu omistus'},
                {value: 4, label: 'Asumisoikeus'},
                {value: 5, label: 'Sääntelemätön vuokra'},
                {value: 6, label: 'Valtion tukema vuokra 10v'},
                {value: 7, label: 'Valtion tukema vuokra pitkä'},
                {value: 8, label: 'Valtion tukema takauslaina'},
                {value: 9, label: 'Muu:'},
              ],
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Erityisryhmät',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.special`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Erityisryhmät',
              options: [
                {value: 1, label: 'Opiskelijat'}, 
                {value: 2, label: 'Nuoret/nuoret aikuiset'},
                {value: 3, label: 'Seniorit'},
                {value: 4, label: 'Muut erityisryhmät, mitä:'},
              ],
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Muut hankkeen mahdolliset kehitysteemat',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.other`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Muut hankkeen mahdolliset kehitysteemat',
              options: [
                {value: 1, label: 'Luontoa säästävät energiaratkaisut'}, 
                {value: 2, label: 'Hiilineutraali Helsinki 2035'},
                {value: 3, label: 'Asuntojen muunneltavuus'},
                {value: 4, label: 'Kohtuuhintainen asuminen'},
                {value: 4, label: 'Yhteisöllisyys'},
                {value: 5, label: 'Kohtuuhintainen asuminen'},
                {value: 6, label: 'Kehittyvä kerrostalo -hanke'},
              ],
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <Row>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hankkeen yleiskuvaus',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.overal_picture`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Hankkeen yleiskuvaus',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hankkeen mahdolliset eristyispiirteet ja mahdolliset kehittämisteemat',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.peculiarities`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Hankkeen mahdolliset eristyispiirteet ja mahdolliset kehittämisteemat',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Lyhyt kuvaus hankkeen suunnilusta ja toteutustavasta ja -organisaatiosta sekä hajikjan käytössä olevista taloudellisista ja muista resursseista',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.descriptions`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Lyhyt kuvaus hankkeen suunnilusta ja toteutustavasta ja -organisaatiosta sekä hajikjan käytössä olevista taloudellisista ja muista resursseista',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <SubTitle>
        {'REFERENSSIT'}
      </SubTitle>
    </Fragment>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      // isSaveClicked: getIsSaveClicked(state),
      // leaseAttributes: getLeaseAttributes(state),
      name: selector(state, `${props.field}.name`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(TargetEdit);
