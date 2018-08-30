// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import Button from '$components/button/Button';
import {displayUIMessage} from '$util/helpers';
import {getApiToken} from '$src/auth/selectors';

type Props = {
  apiToken: string,
  disabled: boolean,
  fileName: string,
  label: string,
  payload: Object,
  url: string,
}

const DownloadDebtCollectionFileButton = ({
  apiToken,
  disabled,
  fileName,
  label,
  payload,
  url,
}: Props) => {

  const handleClick =  debounce(() => {
    const body = JSON.stringify(payload);
    const request = new Request(url, {
      method: 'POST',
      body,
    });
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }
    request.headers.set('Content-Type', 'application/json');

    return fetch(request)
      .then((response) => {
        switch(response.status) {
          case 200:
            return response.blob();
          default:
            break;
        }
      })
      .then((blob) => {
        if (window.navigator.msSaveOrOpenBlob) { // for IE and Edge
          window.navigator.msSaveBlob(blob, fileName);
        } else { // for modern browsers
          const tempLink = document.createElement('a');
          const fileURL = window.URL.createObjectURL(blob);
          tempLink.href = fileURL;
          tempLink.setAttribute('download', fileName);
          tempLink.click();
        }
      })
      .catch((e) => {
        console.error('Error when downloading file: ', e);
        displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
      });
  }, 1000, {leading: true});

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
