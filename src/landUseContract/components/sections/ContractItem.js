//@flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';

type Props = {
  collapseState: boolean,
  contract: Object,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
}

const ContractItem = ({
  collapseState,
  contract,
  receiveCollapseStates,
  stateOptions,
}: Props) => {

  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.CONTRACTS]: {
          [contract.id]: val,
        },
      },
    });
  };

  return (
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={getLabelOfOption(stateOptions, contract.state) || '-'}
      onToggle={handleCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Sopimuksen vaihe'
            text={getLabelOfOption(stateOptions, contract.state) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöspvm'
            text={formatDate(contract.decision_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Allekirjoituspvm'
            text={formatDate(contract.sign_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='ED sopimusnumero'
            text={contract.ed_contract_number || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Diaarinumero'
            text={contract.reference_number
              ? <ExternalLink
                href={getReferenceNumberLink(contract.reference_number)}
                text={contract.reference_number}
              />
              : '-'
            }
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Aluejärjestelyt'
            text={contract.area_arrengements ? 'Kyllä' : 'Ei'}
          />
        </Column>
      </Row>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.contract.id;

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
