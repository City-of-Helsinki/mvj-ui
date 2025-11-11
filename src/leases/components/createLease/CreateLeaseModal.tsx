import React, { useEffect } from "react";
import CreateLeaseForm from "./CreateLeaseForm";
import Modal from "@/components/modal/Modal";
import { ButtonLabels } from "@/components/enums";
import { AreaSearch } from "@/areaSearch/types";

type Props = {
  allowToChangeRelateTo?: boolean;
  areaSearch?: AreaSearch | null;
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};

const CreateLease: React.FC<Props> = ({
  allowToChangeRelateTo = true,
  areaSearch,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const firstFieldRef = React.useRef<any>(null);

  useEffect(() => {
    if (isOpen && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [isOpen]);

  const setRefForFirstField = (element: any) => {
    firstFieldRef.current = element;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ButtonLabels.CREATE_LEASE_IDENTIFIER}
    >
      {isOpen && (
        <CreateLeaseForm
          setRefForFirstField={setRefForFirstField}
          allowToChangeRelateTo={allowToChangeRelateTo}
          allowToChangeReferenceNumberAndNote
          areaSearch={areaSearch}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
};

export default CreateLease;
