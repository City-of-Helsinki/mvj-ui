import React from "react";
import Modal from "components/modal/Modal";
import EditAreaSearchPreparerForm from "areaSearch/components/EditAreaSearchPreparerForm";
import { getAreaSearchList } from "areaSearch/selectors";
import { connect } from "react-redux";
import { formatDate } from "util/helpers";
import FormText from "components/form/FormText";
type OwnProps = {
  allowToChangeRelateTo?: boolean;
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  areaSearchId: number | null | undefined;
};
type Props = OwnProps & {
  areaSearchData: Record<string, any> | null | undefined;
};

const EditAreaSearchPreparerModal = ({
  isOpen,
  onClose,
  onSubmit,
  areaSearchData,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={areaSearchData?.identifier || ""}
      className="EditAreaSearchPreparerModal"
    >
      {areaSearchData && (
        <FormText>
          Saapunut {formatDate(areaSearchData.received_date)} -{" "}
          {areaSearchData.applicants.join(", ")}
        </FormText>
      )}
      <EditAreaSearchPreparerForm
        onSubmit={onSubmit}
        onClose={onClose}
        areaSearchData={areaSearchData}
      />
    </Modal>
  );
};

export default (connect((state, props) => ({
  areaSearchData: getAreaSearchList(state)?.results.find(search => search.id === props.areaSearchId)
}))(EditAreaSearchPreparerModal) as React.ComponentType<OwnProps>);