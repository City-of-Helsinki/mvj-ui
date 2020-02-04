// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import {saveAs} from 'file-saver';

import Button from '$components/button/Button';
import {ButtonColors} from '$components/enums';
import {convertStrToDecimalNumber, displayUIMessage, getFileNameFromResponse} from '$util/helpers';
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
    try {
      const formatedCollectionCharge = {...payload, invoices: payload.invoices.map(invoice=>({...invoice, collection_charge: convertStrToDecimalNumber(invoice.collection_charge)}))};
      const body = JSON.stringify(formatedCollectionCharge);
      const request = new Request(url, {
        method: 'POST',
        body,
      });
      if (apiToken) {
        request.headers.set('Authorization', `Bearer ${apiToken}`);
      }
      request.headers.set('Content-Type', 'application/json');

      const response = await fetch(request);
      switch(response.status) {
        case 200:
          const blob = await response.blob();
          const filename = getFileNameFromResponse(response);

          saveAs(blob, filename);
          break;
        default:
          const errors = await response.json();

          if(errors && errors.detail) {
            displayUIMessage({title: '', body: errors.detail}, {type: 'error'});
          } else {
            displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
          }

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
      className={`${ButtonColors.SUCCESS} no-margin`}
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
