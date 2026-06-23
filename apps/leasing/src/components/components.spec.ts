import { describe, expect, it } from "vitest";
import ErrorIcon from "@/components/icons/ErrorIcon";
import SuccessIcon from "@/components/icons/SuccessIcon";

describe("components", () => {
  describe("ErrorIcon", () => {
    it("should return ErrorIcon", () => {
      const errorIcon: any = ErrorIcon({
        className: "error",
      });
      expect(errorIcon.props.className).to.deep.equal(
        "icons icons__error error",
      );
    });
  });
  describe("SuccessIcon", () => {
    it("should return SuccessIcon", () => {
      const successIcon: any = SuccessIcon({
        className: "success",
      });
      expect(successIcon.props.className).to.deep.equal(
        "icons icons__success success",
      );
    });
  });
});
