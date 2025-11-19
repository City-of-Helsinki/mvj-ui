import flowRight from "lodash/flowRight";
import React from "react";
import { Button } from "react-foundation";
import { reveal } from "@/foundation/reveal";
import { Sizes } from "@/foundation/enums";

interface TraceItem {
  file?: string;
  line?: number;
  class?: string;
  function?: string;
  code?: string;
}

interface ApiErrorData {
  exception?: string;
  message?: string;
  source?: string;
  errors?: Record<string, any>; // Validation errors as object, e.g., { field: ["error"] }
  trace?: TraceItem[];
}

const ApiErrorModal = ({
  data,
  handleDismiss,
  isOpen,
}: {
  data: ApiErrorData;
  handleDismiss: Function;
  isOpen: boolean;
}) => (
  <div className="api-error-modal">
    {data ? <ApiErrorContent data={data} /> : null}
    <Button
      className="api-error-modal__close"
      disabled={!isOpen}
      size={Sizes.LARGE}
      onClick={handleDismiss}
    >
      Dismiss
    </Button>
  </div>
);

const ApiErrorList = ({ errors }: ApiErrorData) => {
  const listObjectErrors = (obj: Record<string, any>) => {
    return (
      <ul>
        {Object.keys(obj).map(function (key, index) {
          if (typeof obj[key] === "object") {
            return (
              <li key={index}>
                {key}
                {listObjectErrors(obj[key])}
              </li>
            );
          }

          return (
            <li key={index}>
              {key}: {obj[key]}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="api-error-modal__error-list">
      <h5 className="api-error-modal__error-list-heading">Error list</h5>
      {listObjectErrors(errors)}
    </div>
  );
};

const ApiErrorStackTrace = ({ trace }: ApiErrorData) => (
  <div className="api-error-modal__trace">
    <h5 className="api-error-modal__trace-heading">Trace</h5>
    <ol className="api-error-modal__trace-nav">
      {trace
        .filter((item) => item.file)
        .map((item, index) => (
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

const ApiErrorContent = ({ data }: { data: ApiErrorData }) => {
  return (
    <div className="api-error-modal__content">
      <h2 className="api-error-modal__title">
        Server error <small>{data.exception}</small>
      </h2>
      <div className="api-error-modal__message">{data.message}</div>
      <div className="api-error-modal__source">{data.source}</div>
      {data.errors ? <ApiErrorList errors={data.errors} /> : null}
      {data.trace ? <ApiErrorStackTrace trace={data.trace} /> : null}
    </div>
  );
};

export default flowRight(
  reveal({
    name: "apiError",
  }),
)(ApiErrorModal);
