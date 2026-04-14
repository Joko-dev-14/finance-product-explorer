import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductRow from "../ui/components/atoms/ProductRow";

const mockProduct = {
  sys: { id: "123" },
  fields: {
    name: "Stocks & Shares ISA",
    description: "A tax-efficient way to invest.",
    image: {
      fields: {
        file: { url: "//images.ctfassets.net/test.png" },
      },
    },
  },
};

describe("ProductRow", () => {
  it("renders the product name", () => {
    render(<ProductRow product={mockProduct} />);
    expect(screen.getByText("Stocks & Shares ISA")).toBeInTheDocument();
  });

  it("description is hidden by default", () => {
    render(<ProductRow product={mockProduct} />);
    const panel = document.getElementById(`product-panel-123`);
    expect(panel).not.toBeVisible();
  });
  it("expands to show description and image when clicked", async () => {
    render(<ProductRow product={mockProduct} />);
    const button = screen.getByRole("button", { name: /stocks & shares isa/i });
    await userEvent.click(button);
    expect(screen.getByText("A tax-efficient way to invest.")).toBeVisible();
    expect(screen.getByRole("img")).toBeVisible();
  });

  it("collapses when clicked a second time", async () => {
    render(<ProductRow product={mockProduct} />);
    const button = screen.getByRole("button", { name: /stocks & shares isa/i });
    await userEvent.click(button);
    await userEvent.click(button);
    const panel = document.getElementById("product-panel-123");
    expect(panel).not.toBeVisible();
  });

  it("button has correct aria-expanded state", async () => {
    render(<ProductRow product={mockProduct} />);
    const button = screen.getByRole("button", { name: /stocks & shares isa/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
