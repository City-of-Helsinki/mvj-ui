import React from "react";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import { saveAs } from "file-saver";
import Button from "/src/components/button/Button";
import { ButtonColors } from "/src/components/enums";
import { displayUIMessage, getFileNameFromResponse } from "/src/util/helpers";
import { getApiToken } from "/src/auth/selectors";
type OwnProps = {
  disabled: boolean;
  label: string;
  payload?: Record<string, any>;
  url: string;
  onSuccess?: () => void;
  onFailure?: () => void;
};
type Props = OwnProps & {
  apiToken: string;
};

const FileDownloadButton = ({
  apiToken,
  disabled,
  label,
  payload,
  url,
  onFailure,
  onSuccess
}: Props) => {
  const fetchFile = async () => {
    try {
      let request;

      if (payload) {
        const body = JSON.stringify(payload);
        request = new Request(url, {
          method: 'POST',
          body
        });
        request.headers.set('Content-Type', 'application/json');
      } else {
        request = new Request(url);
      }

      if (apiToken) {
        request.headers.set('Authorization', `Bearer ${apiToken}`);
      }

      const response = await fetch(request);

      switch (response.status) {
        case 200:
          const blob = await response.blob();
          const filename = getFileNameFromResponse(response);
          saveAs(blob, filename);
          onSuccess && onSuccess();
          break;

        default:
          const errors = await response.json();

          if (errors && errors.detail) {
            displayUIMessage({
              title: '',
              body: errors.detail
            }, {
              type: 'error'
            });
          } else {
            displayUIMessage({
              title: '',
              body: 'Tiedoston lataaminen epäonnistui'
            }, {
              type: 'error'
            });
          }

          onFailure && onFailure();
          break;
      }
    } catch (e) {
      console.error(`Failed to download file with error ${e}`);
      displayUIMessage({
        title: '',
        body: 'Tiedoston lataaminen epäonnistui'
      }, {
        type: 'error'
      });
      onFailure && onFailure();
    }
  };

  const handleClick = debounce(fetchFile, 1000, {
    leading: true
  });
  return <Button className={`${ButtonColors.SUCCESS} no-margin`} disabled={disabled} onClick={handleClick} text={label} />;
};

export default (connect(state => {
  return {
    apiToken: getApiToken(state)
  };
})(FileDownloadButton) as React.ComponentType<OwnProps>);