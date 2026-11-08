import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("is keyboard and pointer operable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add product</Button>);
    await user.click(screen.getByRole("button", { name: "Add product" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards disabled semantics", () => {
    render(<Button disabled>Unavailable</Button>);
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
});
