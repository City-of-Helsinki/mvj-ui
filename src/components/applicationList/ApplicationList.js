// @flow
import React, {Component} from 'react';
import classNames from 'classnames';

import ApplicationListItem from './ApplicationListItem';

type Props = {
  className?: String,
  handleItemClick: Function,
  data: Array<any>,
  headers: Array<any>,
};

class ApplicationList extends Component {
  props: Props;

  render() {
    const {className, data, handleItemClick} = this.props;

    return (
      <div>
        <input type="text" className="form-field__input" placeholder="Hae..."/>
        <ul className={classNames('mvj-application-list', className)}>
          {data.map((itemData, index) => (
            <ApplicationListItem key={index}
                                 data={itemData}
                                 onItemClick={handleItemClick}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default ApplicationList;
