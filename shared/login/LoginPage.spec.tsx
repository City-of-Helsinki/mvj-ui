import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";

afterEach(cleanup);

it("renders the login heading and Helsinki logo", () => {
  render(<LoginPage buttonDisabled={false} onLoginClick={vi.fn()} />);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Helsingin maanvuokrausjärjestelmä",
  );
  expect(screen.getByRole("img", { name: "Helsinki" })).toBeTruthy();
});

it("calls the app login handler when clicked", () => {
  const onLoginClick = vi.fn();
  render(<LoginPage buttonDisabled={false} onLoginClick={onLoginClick} />);

  fireEvent.click(screen.getByRole("button", { name: "Kirjaudu" }));

  expect(onLoginClick).toHaveBeenCalledTimes(1);
});

it("disables the login action while logging in", () => {
  const onLoginClick = vi.fn();
  render(<LoginPage buttonDisabled onLoginClick={onLoginClick} />);
  const button = screen.getByRole("button", { name: "Kirjaudu" });

  expect((button as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(button);
  expect(onLoginClick).not.toHaveBeenCalled();
});
