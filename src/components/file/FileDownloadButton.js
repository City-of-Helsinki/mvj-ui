// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import {saveAs} from 'file-saver/FileSaver';

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

const FileDownloadButton = ({
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

          saveAs(blob, filename);
          break;
        default:
          displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
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
      onClick={handleClick}
      text={label}
    />
  );
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(FileDownloadButton);
