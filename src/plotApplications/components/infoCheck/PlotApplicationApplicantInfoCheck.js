// @flow
import React, {PureComponent} from 'react';

import {Column, Row} from "react-foundation";
import {getApplicantInfoCheckItems} from "../../helpers";
import PlotApplicationApplicantInfoCheckModal from "./PlotApplicationApplicantInfoCheckModal";
import PlotApplicationInfoCheckCollapse from "./PlotApplicationInfoCheckCollapse";
import {connect} from "react-redux";
import {
  getInfoCheckAttributes,
  getIsUpdatingInfoCheckData,
  getWasLastInfoCheckUpdateSuccessfulData
} from "../../selectors";
import {getFieldOptions, getLabelOfOption} from "../../../util/helpers";
import {editInfoCheckItem} from "../../actions";
import {getUserFullName} from "../../../users/helpers";

type Props = {
  infoCheckAttributes: Attributes,
  infoCheckData: Array<Object>,
  section: Object,
  identifier: string,
  editInfoCheckItem: Function
};

type State = {
  isModalOpen: boolean,
  modalCheckItem: ?Object,
  modalPage: number
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props, State> {
  state: State = {
    isModalOpen: false,
    modalCheckItem: null,
    modalPage: 0
  };

  componentDidUpdate(prevProps) {
    const { modalCheckItem } = this.state;

    const id = modalCheckItem?.data.id;

    if (modalCheckItem && this.props.wasUpdateSuccessful[id] && prevProps.wasUpdateSuccessful[id] === null) {
      this.closeModal();
    }
  }


  openModal = (checkItem: Object, skipToForm: boolean): void => {
    this.setState(() => ({
      isModalOpen: true,
      modalCheckItem: checkItem,
      modalPage: (!skipToForm && checkItem.kind.external) ? 1 : 2
    }));
  };

  closeModal = (): void => {
    this.setState(() => ({
      isModalOpen: false,
      modalCheckItem: null,
      modalPage: 0
    }));
  };

  setPage = (page: number): void => {
    this.setState(() => ({
      modalPage: page
    }));
  }

  saveInfoCheck = (data: Object): void => {
    this.props.editInfoCheckItem(data);
  }

  render(): React$Node {
    const {
      isModalOpen,
      modalCheckItem,
      modalPage
    } = this.state;

    const {
      infoCheckAttributes,
      infoCheckData,
    } = this.props;

    const infoCheckStatusOptions = getFieldOptions(infoCheckAttributes, 'state');

    return (
      <PlotApplicationInfoCheckCollapse headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <Row>
          {infoCheckData.map((item) => {
            const statusText = getLabelOfOption(infoCheckStatusOptions, item.data.state);

            return <Column small={6} key={item.kind.type}>
              <Row>
                <Column small={8}>
                  {item.kind.external && <a onClick={() => this.openModal(item, false)}>{item.kind.label}</a>}
                  {!item.kind.external && <span>{item.kind.label}</span>}
                </Column>
                <Column small={4}>
                  {item.kind.external && !item.data.preparer && <span>{statusText}</span>}
                  {(!item.kind.external || item.data.preparer) && <a onClick={() => this.openModal(item, true)}>
                    {statusText}
                    {item.data.preparer && <>, {getUserFullName(item.data.preparer)}</>}
                  </a>}
                </Column>
              </Row>
            </Column>
          })}
        </Row>
        <PlotApplicationApplicantInfoCheckModal
          isOpen={isModalOpen}
          modalPage={modalPage}
          setPage={this.setPage}
          onClose={this.closeModal}
          onSubmit={(data) => this.saveInfoCheck(data)}
          infoCheck={modalCheckItem}
        />
      </PlotApplicationInfoCheckCollapse>
    );
  }
}

export default connect((state, props) => ({
  infoCheckAttributes: getInfoCheckAttributes(state),
  infoCheckData: getApplicantInfoCheckItems(state, props.identifier),
  wasUpdateSuccessful: getWasLastInfoCheckUpdateSuccessfulData(state),
  isUpdating: getIsUpdatingInfoCheckData(state)
}), {
  editInfoCheckItem
})(PlotApplicationApplicantInfoCheck);
