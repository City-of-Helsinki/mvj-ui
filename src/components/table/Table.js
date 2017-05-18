// @flow
import React, {Component, createElement} from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';

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
      <table className={classnames(className, {'clickable-row': !!onRowClick})}>
        {displayHeaders &&
        <thead>
        <tr>
          {dataKeys.map(({key, label}, i) => <th key={i} className={classnames(kebabCase(key))}>{label}</th>)}
          {injectedControls && <th/>}
        </tr>
        </thead>
        }
        <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row.id)}>
            {dataKeys.map(({key}, cellIndex) => (
              <td key={cellIndex}>{isArray(key) ? startCase(key.map(item => get(row, item))) : get(row, key, '-')}</td>
            ))}
            {injectedControls &&
            <td className="controls">
              {injectedControls.map(({className, onClick, text}, i) =>
                createElement('button', {key: i, className, onClick: () => onClick(row)}, text)
              )}
            </td>
            }
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
