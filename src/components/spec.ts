// @ts-nocheck: Only a void function can be called with the 'new' keyword.

import { expect } from "chai";
import ErrorIcon from "src/components/icons/ErrorIcon";
import SuccessIcon from "src/components/icons/SuccessIcon";
import ToastrIcons from "src/components/toastr/ToastrIcons";

describe('components', () => {
  describe('ErrorIcon', () => {
    it('should return ErrorIcon', () => {
      const errorIcon: any = new ErrorIcon({
        className: 'error'
      });
      expect(errorIcon.props.className).to.deep.equal('icons icons__error error');
    });
  });
  describe('SuccessIcon', () => {
    it('should return SuccessIcon', () => {
      const successIcon: any = new SuccessIcon({
        className: 'success'
      });
      expect(successIcon.props.className).to.deep.equal('icons icons__success success');
    });
  });
  describe('ToastrIcons', () => {
    it('should return ToasterIcon', () => {
      const errorIcon: any = new ToastrIcons({
        name: 'error'
      });
      const successIcon: any = new ToastrIcons({
        name: 'success'
      });
      expect(errorIcon.props.className).to.deep.equal('toastr__icons');
      expect(successIcon.props.className).to.deep.equal('toastr__icons');
      expect(new ToastrIcons({
        name: 'not_found'
      })).to.deep.equal({});
    });
  });
});