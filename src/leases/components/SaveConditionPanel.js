// @flow
import React from 'react';
import classNames from 'classnames';

import Button from '../../components/Button';

type Props = {
  show: boolean,
}

const SaveConditionPanel = ({show}: Props) => {
  return (
    <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
      <div className='save-condition-panel__container'>
        <Button
          className='button-green'
          onClick={() => console.log()}
          text='Lisää muistettava ehto'
        />
      </div>
    </div>
  );
};

export default SaveConditionPanel;
