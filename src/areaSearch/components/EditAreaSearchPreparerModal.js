// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import EditAreaSearchPreparerForm from '$src/areaSearch/components/EditAreaSearchPreparerForm';
import {getAreaSearchList} from '$src/areaSearch/selectors';
import {connect} from 'react-redux';
import {formatDate} from '$util/helpers';
import FormText from '$components/form/FormText';

type OwnProps = {
  allowToChangeRelateTo?: boolean,
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
  areaSearchId: ?number,
};

type Props = {
  ...OwnProps,
  areaSearchData: ?Object,
}

class EditAreaSearchPreparerModal extends Component<Props> {
  form: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.form?.wrappedInstance.setFocus();
    }
  }

  setRefForForm: (any) => void = (element) => {
    this.form = element;
  }

  render(): React$Node {
    const {
      isOpen,
      onClose,
      onSubmit,
      areaSearchData,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={areaSearchData?.identifier || ''}
        className="EditAreaSearchPreparerModal"
      >
        {areaSearchData && <FormText>
          Saapunut {formatDate(areaSearchData.received_date)} - {areaSearchData.applicants.join(', ')}
        </FormText>}
        <EditAreaSearchPreparerForm
          ref={this.setRefForForm}
          onSubmit={onSubmit}
          onClose={onClose}
          areaSearchData={areaSearchData}
        />
      </Modal>
    );
  }
}

export default (connect((state, props) => ({
  areaSearchData: getAreaSearchList(state)?.results.find((search) => search.id === props.areaSearchId),
}))(EditAreaSearchPreparerModal): React$ComponentType<OwnProps>);
