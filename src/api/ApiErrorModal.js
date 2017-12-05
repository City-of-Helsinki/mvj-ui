/* eslint-disable */

import flowRight from 'lodash/flowRight';
import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import toArray from 'lodash/toArray';
import {Button} from 'react-foundation';
import {reveal} from '../foundation/reveal';
import {Sizes} from '../foundation/enums';

const ApiErrorModal = ({data, handleDismiss}) => {
  return (
    <div className="api-error-modal">
      {data ? <ApiErrorContent data={data}/> : null}
      <Button className="api-error-modal__close" size={Sizes.LARGE} onClick={handleDismiss}>Sulje</Button>
    </div>
  )
};

const ApiErrorList = ({errors}) => {
  return (
    <div className="api-error-modal__trace">
      <ol className="api-error-modal__trace-nav">
        {errors.length > 0 && errors.map((error, index) => {
          return (
            <li key={index}>{error}</li>
          )
        })}
      </ol>
    </div>
  )
};

const getErrorArray = (errors: Object) => {
  const tempErrors = toArray(errors),
    errorArray = [];
  for(let i = 0; i < tempErrors.length; i++) {
    if(isArray(tempErrors[i])) {
      for(let j = 0; j < tempErrors[i].length; j++) {
        errorArray.push(tempErrors[i][j]);
      }
    } else {
      errorArray.push(tempErrors[i]);
    }
  }
  return errorArray;
}

const ApiErrorContent = ({data}) => {
  const errors = getErrorArray(get(data, 'errors'));
  return (
    <div className="api-error-modal__content">
      <h2 className="api-error-modal__title">Palvelinvirhe<small>{data.exception}</small></h2>
      {errors ? <ApiErrorList errors={errors}/> : null}
    </div>
  )
};

export default flowRight(
  reveal({name: 'apiError'}),
)(ApiErrorModal);
