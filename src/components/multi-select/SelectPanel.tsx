import React, { Component } from "react";
import SelectItem from "./SelectItem";
import SelectList from "./SelectList";
import { filterOptions } from "./helpers";
import type { Option } from "./SelectItem";
type Props = {
  ItemRenderer?: (...args: Array<any>) => any;
  options: Array<Option>;
  selected: Array<any>;
  selectAllLabel?: string;
  onSelectedChanged: (selected: Array<any>) => void;
  disabled?: boolean;
  hasSelectAll: boolean;
  filterOptions?: (options: Array<Option>, filter: string) => Array<Option>;
};
type State = {
  searchText: string;
  focusIndex: number;
};

class SelectPanel extends Component<Props, State> {
  state = {
    searchText: '',
    focusIndex: 0
  };
  selectAll = () => {
    const {
      onSelectedChanged,
      options
    } = this.props;
    const allValues = options.map(o => o.value);
    onSelectedChanged(allValues);
  };
  selectNone = () => {
    const {
      onSelectedChanged
    } = this.props;
    onSelectedChanged([]);
  };
  selectAllChanged = (checked: boolean) => {
    if (checked) {
      this.selectAll();
    } else {
      this.selectNone();
    }
  };
  handleSearchChange = (e: {
    target: {
      value: any;
    };
  }) => {
    this.setState({
      searchText: e.target.value,
      focusIndex: -1
    });
  };
  handleItemClicked = (index: number) => {
    this.setState({
      focusIndex: index
    });
  };
  clearSearch = () => {
    this.setState({
      searchText: ''
    });
  };
  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.which) {
      case 38:
        // Up Arrow
        if (e.altKey) {
          return;
        }

        this.updateFocus(-1);
        break;

      case 40:
        // Down Arrow
        if (e.altKey) {
          return;
        }

        this.updateFocus(1);
        break;

      default:
        return;
    }

    e.stopPropagation();
    e.preventDefault();
  };

  allAreSelected() {
    const {
      options,
      selected
    } = this.props;
    return options.length === selected.length;
  }

  filteredOptions() {
    const {
      searchText
    } = this.state;
    const {
      options,
      filterOptions: customFilterOptions
    } = this.props;
    return customFilterOptions ? customFilterOptions(options, searchText) : filterOptions(options, searchText);
  }

  updateFocus(offset: number) {
    const {
      focusIndex
    } = this.state;
    const {
      options
    } = this.props;
    let newFocus = focusIndex + offset;
    newFocus = Math.max(0, newFocus);
    newFocus = Math.min(newFocus, options.length);
    this.setState({
      focusIndex: newFocus
    });
  }

  render() {
    const {
      focusIndex
    } = this.state;
    const {
      ItemRenderer,
      selectAllLabel,
      disabled,
      hasSelectAll
    } = this.props;
    const selectAllOption = {
      label: selectAllLabel || 'Valitse kaikki',
      value: ''
    };
    return <div className='multi-select__panel' role='listbox' onKeyDown={this.handleKeyDown}>
      {hasSelectAll && <SelectItem focused={focusIndex === 0} checked={this.allAreSelected()} option={selectAllOption} onSelectionChanged={this.selectAllChanged} onClick={() => this.handleItemClicked(0)} ItemRenderer={ItemRenderer} disabled={disabled} />}

      <SelectList {...this.props} options={this.filteredOptions()} focusIndex={focusIndex - 1} onClick={(e, index) => this.handleItemClicked(index + 1)} ItemRenderer={ItemRenderer} disabled={disabled} />
    </div>;
  }

}

export default SelectPanel;