import { expect } from "chai";
import ErrorIcon from "@/components/icons/ErrorIcon";
import SuccessIcon from "@/components/icons/SuccessIcon";
import ToastrIcons from "@/components/toastr/ToastrIcons";

describe('components', () => {
  describe('ErrorIcon', () => {
    it('should return ErrorIcon', () => {
      const errorIcon: any = ErrorIcon({
        className: 'error'
      });
      expect(errorIcon.props.className).to.deep.equal('icons icons__error error');
    });
  });
  describe('SuccessIcon', () => {
    it('should return SuccessIcon', () => {
      const successIcon: any = SuccessIcon({
        className: 'success'
      });
      expect(successIcon.props.className).to.deep.equal('icons icons__success success');
    });
  });
  describe('ToastrIcons', () => {
    it('should return ToasterIcon', () => {
      const errorIcon: any = ToastrIcons({
        name: 'error'
      });
      const successIcon: any = ToastrIcons({
        name: 'success'
      });
      expect(errorIcon.props.className).to.deep.equal('toastr__icons');
      expect(successIcon.props.className).to.deep.equal('toastr__icons');
      expect(ToastrIcons({
        name: 'not_found'
      })).to.deep.equal(null);
    });
  });
});