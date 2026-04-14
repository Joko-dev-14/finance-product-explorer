import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryCard from "../ui/components/molecules/CategoryCard";

const mockCategory = {
  sys: { id: "1" },
  fields: {
    name: "ISAs",
    products: [
      {
        sys: { id: "p1" },
        fields: {
          name: "Stocks & Shares ISA",
          description: "Invest tax-efficiently.",
          image: null,
        },
      },
    ],
  },
};

describe("CategoryCard", () => {
  it("renders the category name", () => {
    render(<CategoryCard category={mockCategory} isActive={true} />);
    expect(screen.getByText("ISAs")).toBeInTheDocument();
  });

  it("renders products when active", () => {
    render(<CategoryCard category={mockCategory} isActive={true} />);
    expect(screen.getByText("Stocks & Shares ISA")).toBeInTheDocument();
  });

  it("does not render products when inactive", () => {
    render(<CategoryCard category={mockCategory} isActive={false} />);
    expect(screen.queryByText("Stocks & Shares ISA")).not.toBeInTheDocument();
  });

  it("calls onSelect when inactive card is clicked", async () => {
    const onSelect = jest.fn();
    render(
      <CategoryCard
        category={mockCategory}
        isActive={false}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole("tab"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when Enter is pressed on inactive card", async () => {
    const onSelect = jest.fn();
    render(
      <CategoryCard
        category={mockCategory}
        isActive={false}
        onSelect={onSelect}
      />,
    );
    screen.getByRole("tab").focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
