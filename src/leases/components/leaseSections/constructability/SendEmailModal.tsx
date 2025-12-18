import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash/debounce";
import Button from "@/components/button/Button";
import DualListBox from "react-dual-listbox";
import FormText from "@/components/form/FormText";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import { fetchOfficers } from "@/users/requestsAsync";
import { ButtonColors } from "@/components/enums";
import { getUserOptions } from "@/users/helpers";
import { sortStringByKeyAsc } from "@/util/helpers";
import type { SelectListOption } from "@/types";

type FilterProps = {
  available: string;
  selected: string;
};

type Props = {
  isOpen: boolean;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onSend: (...args: Array<any>) => any;
};

const SendEmailModal: React.FC<Props> = ({
  isOpen,
  onCancel,
  onClose,
  onSend,
}) => {
  const [dualListBox, setDualListBox] = useState<any>(null);
  const [filterAvailable, setFilterAvailable] =
    useState<FilterProps["available"]>("");
  const [filterSelected, setFilterSelected] =
    useState<FilterProps["selected"]>("");
  const [selectedUsers, setSelectedUsers] = useState<Array<SelectListOption>>(
    [],
  );
  const [text, setText] = useState<string>("");
  const [userOptions, setUserOptions] = useState<Array<SelectListOption>>([]);

  const prevIsOpen = useRef<boolean>(false);

  const getUserList = useCallback(
    async (search: string) => {
      const users = await fetchOfficers({
        search,
      });
      // Both selected and available arrays on DualListBox use options for filtering. So add selectedUsers to search results and remove duplicates
      const uniqueUsers = [...getUserOptions(users), ...selectedUsers]
        .filter(
          (a, index, array) =>
            array.findIndex((b) => a.value === b.value) === index,
        )
        .sort((a, b) => sortStringByKeyAsc(a, b, "label"));
      setUserOptions(uniqueUsers);
    },
    [selectedUsers],
  );

  const getUserListDebounced = useMemo(
    () =>
      debounce((search: string) => {
        getUserList(search);
      }, 500),
    [getUserList],
  );

  useEffect(() => {
    // Only when modal is opened and previously was closed
    if (!prevIsOpen.current && isOpen) {
      if (dualListBox) {
        // Set focus on first field
        dualListBox.focus();
      }
      // Clear inputs when modal is (re-)opened
      setFilterAvailable("");
      setFilterSelected("");
      setSelectedUsers([]);
      setText("");
      setUserOptions([]);

      // Get default user list
      getUserList("");
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, dualListBox, getUserList]);

  const handleUserListChange = (selected: Array<SelectListOption>) => {
    setSelectedUsers(selected);
  };

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const handleFilterChange = (filter: FilterProps) => {
    const prevFilterAvailable = filterAvailable;
    setFilterSelected(filter.selected);
    setFilterAvailable(filter.available);

    if (filter.available !== prevFilterAvailable) {
      // Fetch users when available filter changes.
      getUserListDebounced(filter.available);
    }
  };

  const handleSend = () => {
    onSend({
      recipients: selectedUsers.map((user) => Number(user.value)),
      text,
    });
  };

  return (
    <Modal
      className="modal-autoheight"
      title="Lähetä sähköposti"
      isOpen={isOpen}
      onClose={onClose}
    >
      <FormText>Valitse sähköpostin vastaanottajat</FormText>
      <DualListBox
        icons={{
          moveToAvailable: "<",
          moveAllToAvailable: "<<",
          moveToSelected: ">",
          moveAllToSelected: ">>",
        }}
        availableRef={(ref) => setDualListBox(ref)}
        canFilter
        filter={{ available: filterAvailable, selected: filterSelected }}
        lang={{
          availableFilterPlaceholder: "Hae vastaanottajia...",
          selectedFilterPlaceholder: "Hae valittuja vastaanottajia...",
        }}
        onChange={handleUserListChange}
        onFilterChange={handleFilterChange}
        options={userOptions}
        selected={selectedUsers}
        simpleValue={false}
      />

      <FormText>
        <label htmlFor="send-email_text">
          {" "}
          Sähköpostiin liittyvä kommentti
        </label>
      </FormText>
      <TextAreaInput
        className="no-margin"
        id="send-email_text"
        onChange={handleTextChange}
        placeholder=""
        rows={4}
        value={text}
      />

      <ModalButtonWrapper>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onCancel}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!selectedUsers.length}
          onClick={handleSend}
          text="Lähetä"
        />
      </ModalButtonWrapper>
    </Modal>
  );
};

export default SendEmailModal;
