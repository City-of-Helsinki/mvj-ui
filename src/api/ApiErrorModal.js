/* eslint-disable */

import flowRight from 'lodash/flowRight';
import React from 'react';
import {Button} from 'react-foundation';
import {reveal} from '../foundation/reveal';
import {Sizes} from '../foundation/enums';

const ApiErrorModal = ({data, handleDismiss}) => (
  <div className="api-error-modal">
    {data ? <ApiErrorContent data={data}/> : null}
    <Button className="api-error-modal__close" size={Sizes.LARGE} onClick={handleDismiss}>Dismiss</Button>
  </div>
);

const ApiErrorList = ({errors}) => {
  const listObjectErrors = (obj: Object) => {
    return (
      <ul>
        {Object.keys(obj).map(function(key, index) {
          if (typeof obj[key] === 'object') {
            return <li key={index}>{key}{listObjectErrors(obj[key])}</li>
          }
          return <li key={index}>{key}: {obj[key]}</li>;
        })}
      </ul>
    );
  }

  return <div>{listObjectErrors(errors)}</div>
}

const ApiErrorStackTrace = ({trace}) => (
  <div className="api-error-modal__trace">
    <h5 className="api-error-modal__trace-heading">Trace</h5>
    <ol className="api-error-modal__trace-nav">
      {trace.filter((item) => item.file).map((item, index) => (
        <li className="api-error-modal__trace-item" key={index}>
          <span className="api-error-modal__trace-source">
            {item.file}({item.line})
          </span>
          &nbsp;
          <span className="api-error-modal__trace-function">
            {item.class ? `${item.class}::${item.function}` : item.function}
          </span>
        </li>
      ))}
    </ol>
  </div>
);

const ApiErrorContent = ({data}) => (
  <div className="api-error-modal__content">
    <h2 className="api-error-modal__title">Server error <small>{data.exception}</small></h2>
    <div className="api-error-modal__message">{data.message}</div>
    <div className="api-error-modal__source">{data.source}</div>
    {data.errors ? <ApiErrorList errors={data.errors}/> : null}
    {data.trace ? <ApiErrorStackTrace trace={data.trace}/> : null}
  </div>
);

export default flowRight(
  reveal({name: 'apiError'}),
)(ApiErrorModal);
