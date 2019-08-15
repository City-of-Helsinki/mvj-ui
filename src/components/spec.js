// @flow
import {expect} from 'chai';

import ErrorIcon from '$components/icons/ErrorIcon';
import SuccessIcon from '$components/icons/SuccessIcon';
import ToastrIcons from '$components/toastr/ToastrIcons';

// $FlowFixMe
describe('components', () => {

  // $FlowFixMe
  describe('ErrorIcon', () => {

    // $FlowFixMe
    it('should return ErrorIcon', () => {
      const errorIcon: any = new ErrorIcon({className: 'error'});

      expect(errorIcon.props.className).to.deep.equal('icons icons__error error');
    });
  });

  // $FlowFixMe
  describe('SuccessIcon', () => {

    // $FlowFixMe
    it('should return SuccessIcon', () => {
      const successIcon: any = new SuccessIcon({className: 'success'});

      expect(successIcon.props.className).to.deep.equal('icons icons__success success');
    });
  });

  describe('ToastrIcons', () => {

    // $FlowFixMe
    it('should return ToasterIcon', () => {
      const errorIcon: any = new ToastrIcons({name: 'error'});
      const successIcon: any = new ToastrIcons({name: 'success'});

      expect(errorIcon.props.className).to.deep.equal('toastr__icons');
      expect(successIcon.props.className).to.deep.equal('toastr__icons');
      expect(new ToastrIcons({name: 'not_found'})).to.deep.equal({});
    });
  });
});
