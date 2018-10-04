// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import {getApiToken} from '$src/auth/selectors';
import {displayUIMessage, getApiUrlWithOutVersionSuffix} from '$util/helpers';

type Props = {
  apiToken: string,
  fileKey: string,
  fileName?: string,
  identifier: string,
  idKey?: string,
  label: string,
  langCode?: string,
  prefix: 'ktjkii' | 'ktjkir',
}

const KtjLink = ({
  apiToken,
  fileKey,
  fileName = 'ktj_document',
  identifier,
  idKey = 'kohdetunnus',
  label,
  langCode = 'fi',
  prefix = 'ktjkir',
}: Props) => {

  const handleClick =  debounce(() => {
    const apiUrlWithOutVersionSuffix = getApiUrlWithOutVersionSuffix();
    const request = new Request(`${apiUrlWithOutVersionSuffix}/${prefix}/tuloste/${fileKey}/pdf?${idKey}=${identifier}&lang=${langCode}`);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }
    request.headers.set('Content-Type', 'application/pdf');

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
        const filename = `${fileName}_${identifier}.pdf`;
        if (window.navigator.msSaveOrOpenBlob) { // for IE and Edge
          window.navigator.msSaveBlob(blob, filename);
        } else { // for modern browsers
          const tempLink = document.createElement('a');
          const fileURL = window.URL.createObjectURL(blob);
          tempLink.href = fileURL;
          tempLink.setAttribute('download', filename);
          tempLink.click();
        }
      })
      .catch((e) => {
        console.error('Error when downloading file: ', e);
        displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
      });
  }, 1000, {leading: true});

  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleClick();
    }
  };

  return <a onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>{label}</a>;
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(KtjLink);
