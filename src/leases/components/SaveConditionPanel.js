// @flow
import React from 'react';
import classNames from 'classnames';

import Button from '../../components/Button';

type Props = {
  createCondition: Function,
  show: boolean,
}

const SaveConditionPanel = ({createCondition, show}: Props) => {
  return (
    <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
      <div className='save-condition-panel__container'>
        <Button
          className='button-green'
          onClick={() => createCondition()}
          text='Lisää muistettava ehto'
        />
      </div>
    </div>
  );
};

export default SaveConditionPanel;
