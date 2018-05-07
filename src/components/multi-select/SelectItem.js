// @flow
import React, {Component} from 'react';
import classNames from 'classnames';

export type Option = {
    value: any,
    label: string
};

type DefaultItemRendererProps = {
  checked: boolean,
  option: Option,
  disabled?: boolean,
  onClick: (event: MouseEvent) => void
};

const DefaultItemRenderer = ({checked, option, onClick, disabled}: DefaultItemRendererProps) => {
  return <span
    className="multi-select__select-item-renderer"
  >
    <input
      type="checkbox"
      onChange={onClick}
      checked={checked}
      tabIndex="-1"
      disabled={disabled}
    />
    <span className={classNames(
      'multi-select__select-item-renderer-label',
      {'disabled': disabled})}>
      {option.label}
    </span>
  </span>;
};

type SelectItemProps = {
  ItemRenderer: Function,
  option: Option,
  checked: boolean,
  focused?: boolean,
  disabled?: boolean,
  onSelectionChanged: (checked: boolean) => void,
  onClick: (event: MouseEvent) => void
};

type SelectItemState = {
  hovered: boolean
};

class SelectItem extends Component {
  props: SelectItemProps
  state: SelectItemState = {
    hovered: false,
  }

  static defaultProps = {
    ItemRenderer: DefaultItemRenderer,
  }

  componentDidMount() {
    this.updateFocus();
  }

  componentDidUpdate() {
    this.updateFocus();
  }

  itemRef: ?HTMLElement

  onChecked = (e: {target: {checked: boolean}}) => {
    const {onSelectionChanged} = this.props;
    const {checked} = e.target;

    onSelectionChanged(checked);
  }

  toggleChecked = () => {
    const {checked, onSelectionChanged} = this.props;
    onSelectionChanged(!checked);
  }

  handleClick = (e: MouseEvent) => {
    const {onClick} = this.props;
    this.toggleChecked();
    onClick(e);
  }

  updateFocus() {
    const {focused} = this.props;

    if (focused && this.itemRef) {
      this.itemRef.focus();
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.which) {
      case 13: // Enter
      case 32: // Space
        this.toggleChecked();
        break;
      default:
        return;
    }

    e.preventDefault();
  }

  render() {
    const {ItemRenderer, option, checked, focused, disabled} = this.props;
    const {hovered} = this.state;

    return <label
      className={classNames(
        'multi-select__select-item',
        {'is-focused': (focused || hovered)}
      )}
      role="option"
      aria-selected={checked}
      selected={checked}
      tabIndex="-1"
      ref={ref => this.itemRef = ref}
      onKeyDown={this.handleKeyDown}
      onMouseOver={() => this.setState({hovered: true})}
      onMouseOut={() => this.setState({hovered: false})}
    >
      <ItemRenderer
        option={option}
        checked={checked}
        onClick={this.handleClick}
        disabled={disabled}
      />
    </label>;
  }
}

export default SelectItem;
