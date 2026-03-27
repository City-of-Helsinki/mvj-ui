import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash/debounce";
import Button from "@/components/button/Button";
import CheckboxInput from "@/components/inputs/CheckboxInput";
import DualListBox from "react-dual-listbox";
import FormText from "@/components/form/FormText";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { fetchLeases } from "@/leases/requestsAsync";
import { ButtonColors } from "@/components/enums";
import { getContentLeaseOption } from "@/leases/helpers";
import { sortStringByKeyAsc } from "@/util/helpers";
import type { SelectListOption } from "@/types";

type FilterProps = {
  available: string;
  selected: string;
};

type Props = {
  currentLeaseId: number;
  isOpen: boolean;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};

const AttachDecisionModal: React.FC<Props> = ({
  currentLeaseId,
  isOpen,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const [dualListBox, setDualListBox] = useState<any>(null);
  const [copyConditions, setCopyConditions] = useState<boolean>(false);
  const [filterAvailable, setFilterAvailable] =
    useState<FilterProps["available"]>("");
  const [filterSelected, setFilterSelected] =
    useState<FilterProps["selected"]>("");
  const [leaseOptions, setLeaseOptions] = useState<Array<Record<string, any>>>(
    [],
  );
  const [selectedLeases, setSelectedLeases] = useState<
    Array<Record<string, any>>
  >([]);
  const prevIsOpen = useRef<boolean>(false);

  const getLeaseList = useCallback(
    async (search: string) => {
      const leases = await fetchLeases({
        succinct: true,
        identifier: search,
      });
      // Both selected and available arrays on DualListBox use options for filtering. So add selectedUsers to search results and remove duplicates
      const uniqueLeases = [
        ...leases.map((lease) => getContentLeaseOption(lease)),
        ...selectedLeases,
      ]
        .filter(
          (a, index, array) =>
            currentLeaseId != a.value &&
            array.findIndex((b) => a.value === b.value) === index,
        )
        .sort((a, b) => sortStringByKeyAsc(a, b, "label"));
      setLeaseOptions(uniqueLeases);
    },
    [selectedLeases, currentLeaseId],
  );

  const getLeaseListDebounced = useMemo(
    () =>
      debounce((search: string) => {
        getLeaseList(search);
      }, 500),
    [getLeaseList],
  );

  useEffect(() => {
    // Only when modal is opened and previously was closed
    if (!prevIsOpen.current && isOpen) {
      if (dualListBox) {
        // Set focus on first field
        dualListBox.focus();
      }

      // Clear inputs when modal is (re-)opened
      setCopyConditions(false);
      setFilterAvailable("");
      setFilterSelected("");
      setSelectedLeases([]);
      // Get default lease list
      getLeaseList("");
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, dualListBox, getLeaseList]);

  const handleLeaseListChange = (selected: Array<SelectListOption>) => {
    setSelectedLeases(selected);
  };

  const handleFilterChange = (filter: FilterProps) => {
    const prevFilterAvailable = filterAvailable || "";
    setFilterSelected(filter.selected);
    setFilterAvailable(filter.available);

    if (filter.available !== prevFilterAvailable) {
      // Fetch leases when available filter changes
      getLeaseListDebounced(filter.available || "");
    }
  };

  const handleCheckboxChange = (value: any) => {
    setCopyConditions(value);
  };

  const handleSubmit = () => {
    const payload: any = {
      leases: selectedLeases.map((lease) => Number(lease.value)),
    };

    if (copyConditions) {
      payload.copy_conditions = true;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      className="modal-autoheight"
      title="Liitä vuokrauksiin"
      isOpen={isOpen}
      onClose={onClose}
    >
      <FormText>Valitse vuokratunnukset</FormText>
      <DualListBox
        icons={{
          moveToAvailable: "<",
          moveAllToAvailable: "<<",
          moveToSelected: ">",
          moveAllToSelected: ">>",
        }}
        availableRef={(ref) => setDualListBox(ref)}
        canFilter
        filter={{
          available: filterAvailable,
          selected: filterSelected,
        }}
        lang={{
          availableFilterPlaceholder: "Hae vuokratunnuksia...",
          selectedFilterPlaceholder: "Hae valittuja vuokratunnuksia...",
        }}
        onChange={handleLeaseListChange}
        onFilterChange={handleFilterChange}
        options={leaseOptions}
        selected={selectedLeases}
        simpleValue={false}
      />

      <CheckboxInput
        checkboxName="copy_conditions"
        value={copyConditions}
        onChange={handleCheckboxChange}
        options={[
          {
            value: true,
            label: "Liitä myös ehdot",
          },
        ]}
      />

      <ModalButtonWrapper>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onCancel}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!selectedLeases.length}
          onClick={handleSubmit}
          text="Liitä"
        />
      </ModalButtonWrapper>
    </Modal>
  );
};

export default AttachDecisionModal;
