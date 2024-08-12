import React, { PureComponent } from "react";
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
type State = {
  copyConditions: boolean;
  filter: FilterProps;
  leaseOptions: Array<Record<string, any>>;
  selectedLeases: Array<Record<string, any>>;
};

class AttachDecisionModal extends PureComponent<Props, State> {
  dualListBox: any;
  state = {
    copyConditions: false,
    filter: {
      available: '',
      selected: ''
    },
    leaseOptions: [],
    selectedLeases: []
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      // Set focus on first field
      if (this.dualListBox) {
        this.dualListBox.focus();
      }

      // Clear inputs
      this.setState({
        copyConditions: false,
        filter: {
          available: '',
          selected: ''
        },
        selectedLeases: []
      });
      // Get default user list
      this.getLeaseList('');
    }
  }

  getLeaseList = async (search: string) => {
    const {
      currentLeaseId
    } = this.props;
    const {
      selectedLeases
    } = this.state;
    const leases = await fetchLeases({
      succinct: true,
      identifier: search
    });
    // Both selected and available arrays on DualListBox use options for filtering. So add selectedUsers to search results and remove duplicates
    const uniqueLeases = [...leases.map(lease => getContentLeaseOption(lease)), ...selectedLeases].filter((a, index, array) => currentLeaseId != a.value && array.findIndex(b => a.value === b.value) === index).sort((a, b) => sortStringByKeyAsc(a, b, 'label'));
    this.setState({
      leaseOptions: uniqueLeases
    });
  };
  getLeaseListDebounced = debounce((search: string) => {
    this.getLeaseList(search);
  }, 500);
  handleLeaseListChange = (selected: Array<Record<string, any>>) => {
    this.setState({
      selectedLeases: selected
    });
  };
  handleFilterChange = (filter: FilterProps) => {
    const {
      filter: selectedFilter
    } = this.state;
    this.setState({
      filter
    });

    if (filter.available !== selectedFilter.available) {
      // Fetch users when available filter changes.
      this.getLeaseListDebounced(filter.available);
    }
  };
  handleCheckboxChange = (value: any) => {
    this.setState({
      copyConditions: value
    });
  };
  handleSubmit = () => {
    const {
      onSubmit
    } = this.props;
    const {
      copyConditions,
      selectedLeases
    } = this.state;
    const payload: any = {
      leases: selectedLeases.map(lease => Number(lease.value))
    };

    if (copyConditions) {
      payload.copy_conditions = true;
    }

    onSubmit(payload);
  };

  render() {
    const {
      isOpen,
      onCancel,
      onClose
    } = this.props;
    const {
      copyConditions,
      filter,
      leaseOptions,
      selectedLeases
    } = this.state;
    return <Modal className='modal-autoheight' title='Liitä vuokrauksiin' isOpen={isOpen} onClose={onClose}>
        <FormText>Valitse vuokratunnukset</FormText>
        <DualListBox availableRef={ref => this.dualListBox = ref} canFilter filter={filter} filterPlaceholder='Hae vuokratunnuksia...' onChange={this.handleLeaseListChange} onFilterChange={this.handleFilterChange} options={leaseOptions} selected={selectedLeases} simpleValue={false} />

        <CheckboxInput checkboxName='copy_conditions' value={copyConditions} onChange={this.handleCheckboxChange} options={[{
        value: true,
        label: 'Liitä myös ehdot'
      }]} />

        <ModalButtonWrapper>
          <Button className={ButtonColors.SECONDARY} onClick={onCancel} text='Peruuta' />
          <Button className={ButtonColors.SUCCESS} disabled={!selectedLeases.length} onClick={this.handleSubmit} text='Liitä' />
        </ModalButtonWrapper>
      </Modal>;
  }

}

export default AttachDecisionModal;