// @flow
import React, {Component, createElement} from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

type Props = {
  className?: string,
  data: Array<any>,
  dataKeys: Array<any>,
  displayHeaders: boolean,
  injectedControls?: Array<any>,
  onRowClick?: Function,
};

class Table extends Component {
  props: Props;

  static defaultProps = {
    displayHeaders: true,
  };

  render() {
    const {className, data, dataKeys, displayHeaders, onRowClick, injectedControls} = this.props;

    return (
      <table className={classnames(className)}>
        {displayHeaders &&
        <thead>
        <tr>
          {dataKeys.map(({key, label}, i) => <th key={i} className={classnames(kebabCase(key))}>{label}</th>)}
        </tr>
        </thead>
        }
        <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row.id)}>
            {dataKeys.map(({key}, cellIndex) => (
              <td key={cellIndex}>{get(row, key)}</td>
            ))}
            {injectedControls && injectedControls.map(({className, onClick, text}, injectIndex) =>
              <td key={injectIndex}>
                {createElement('button', {className, onClick: () => onClick(row)}, text)}
              </td>
            )}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
