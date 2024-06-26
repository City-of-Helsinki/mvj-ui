import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import ExcelIcon from "/src/components/icons/ExcelIcon";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import { getApiToken } from "/src/auth/selectors";
import { displayUIMessage } from "util/helpers";
type Props = {
  label: string;
  apiToken: string;
  fileName?: string;
  identifier: string;
  url: string;
  query: string;
};
type State = {
  isLoading: boolean;
};

class ExcelLink extends PureComponent<Props, State> {
  state = {
    isLoading: false
  };
  handleClick = () => {
    const {
      apiToken,
      fileName = 'Raportti',
      identifier,
      url,
      query
    } = this.props;
    const {
      isLoading
    } = this.state;
    const filename = `${identifier}-${fileName}.xlsx`;
    if (isLoading) return;
    this.setState({
      isLoading: true
    });
    const request = new Request(`${url}?${query}&format=xlsx`);

    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

    request.headers.set('Content-Type', 'application/xlsx');

    const stopLoader = () => {
      this.setState({
        isLoading: false
      });
    };

    const fetchFile = async () => {
      try {
        const response = await fetch(request);

        switch (response.status) {
          case 200:
            const blob = await response.blob();
            saveAs(blob, filename);
            break;

          default:
            displayUIMessage({
              title: '',
              body: 'Tiedoston lataaminen epäonnistui'
            }, {
              type: 'error'
            });
            break;
        }

        stopLoader();
      } catch (e) {
        console.error('Error when downloading file: ', e);
        displayUIMessage({
          title: '',
          body: 'Tiedoston lataaminen epäonnistui'
        }, {
          type: 'error'
        });
        stopLoader();
      }
    };

    fetchFile();
  };
  handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleClick();
    }
  };

  render() {
    const {
      label
    } = this.props,
          {
      isLoading
    } = this.state;
    return <a onClick={this.handleClick} onKeyDown={this.handleKeyDown} tabIndex={0}>
      <ExcelIcon />
      {label}
      <LoaderWrapper className='small-inline-wrapper'>
        <Loader isLoading={isLoading} className='small' />
      </LoaderWrapper>
    </a>;
  }

}

export default connect(state => {
  return {
    apiToken: getApiToken(state)
  };
})(ExcelLink);