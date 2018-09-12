// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import Button from '$components/button/Button';
import {displayUIMessage, getFileNameFromResponse} from '$util/helpers';
import {getApiToken} from '$src/auth/selectors';

type Props = {
  apiToken: string,
  disabled: boolean,
  label: string,
  payload: Object,
  url: string,
}

const DownloadDebtCollectionFileButton = ({
  apiToken,
  disabled,
  label,
  payload,
  url,
}: Props) => {

  const fetchFile = async() => {
    const body = JSON.stringify(payload);
    const request = new Request(url, {
      method: 'POST',
      body,
    });
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }
    request.headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(request);
      switch(response.status) {
        case 200:
          const blob = await response.blob();
          const filename = getFileNameFromResponse(response);

          if (window.navigator.msSaveOrOpenBlob) { // for IE and Edge
            window.navigator.msSaveBlob(blob, filename);
          } else { // for modern browsers
            const tempLink = document.createElement('a');
            const fileURL = window.URL.createObjectURL(blob);
            tempLink.href = fileURL;
            tempLink.setAttribute('download', filename);
            tempLink.click();
          }
          break;
        default:
          break;
      }
    } catch(e) {
      console.error(`Failed to download file with error ${e}`);
      displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
    }
  };

  const handleClick = debounce(fetchFile, 1000, {leading: true});

  return (
    <Button
      className='button-green no-margin'
      disabled={disabled}
      label={label}
      onClick={handleClick}
    />
  );
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(DownloadDebtCollectionFileButton);
