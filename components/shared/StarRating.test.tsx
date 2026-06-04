import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { StarRating } from "@/components/shared/StarRating";
import { renderWithIntl } from "@/test/intl";

describe("StarRating", () => {
  it("renders display stars and optional numeric value", () => {
    renderWithIntl(<StarRating rating={4.3} showValue />);

    expect(screen.getByRole("img", { name: "4.3 stars" })).toBeInTheDocument();
    expect(screen.getByText("4.3")).toBeInTheDocument();
  });

  it("renders the configured number of stars in display mode", () => {
    const { container } = renderWithIntl(<StarRating rating={2} max={4} />);

    const stars = container.querySelectorAll('[role="img"] svg');
    expect(stars).toHaveLength(4);
  });

  it("calls onChange when a star is clicked in input mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithIntl(<StarRating mode="input" rating={2} onChange={onChange} />);

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-label",
      "Rate your experience from 1 to 5 stars",
    );

    await user.click(screen.getByRole("radio", { name: "4 stars" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("marks selected stars as checked in input mode", () => {
    renderWithIntl(<StarRating mode="input" rating={3} onChange={vi.fn()} />);

    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[3]).toHaveAttribute("aria-checked", "false");
  });
});
