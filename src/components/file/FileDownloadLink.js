// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import {displayUIMessage} from '$util/helpers';
import {getApiToken} from '$src/auth/selectors';

type Props = {
  apiToken: string,
  className?: string,
  fileName: string,
  fileUrl: string,
  label: string,
}

const FileDownloadLink = ({
  apiToken,
  className,
  fileName,
  fileUrl,
  label,
}: Props) => {

  const handleClick =  debounce(() => {
    const request = new Request(fileUrl);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

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

  return <a className={className} onClick={handleClick}>{label}</a>;
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(FileDownloadLink);
