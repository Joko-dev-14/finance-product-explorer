import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryCarousel from "../ui/components/organisms/CategoryCarousel";

const mockCategories = [
  {
    sys: { id: "1" },
    fields: {
      name: "ISAs",
      products: [],
    },
  },
  {
    sys: { id: "2" },
    fields: {
      name: "Savings",
      products: [],
    },
  },
  {
    sys: { id: "3" },
    fields: {
      name: "Pensions",
      products: [],
    },
  },
];

describe("CategoryCarousel", () => {
  it("renders Explore Accounts heading", () => {
    render(<CategoryCarousel categories={mockCategories} />);
    expect(screen.getByText("Explore Accounts")).toBeInTheDocument();
  });

  it("defaults to the Savings category", () => {
    render(<CategoryCarousel categories={mockCategories} />);
    const savingsTab = screen
      .getAllByRole("tab")
      .find((tab) => tab.getAttribute("aria-selected") === "true");
    expect(savingsTab).toHaveTextContent("Savings");
  });

  it("navigates to next category on next button click", async () => {
    render(<CategoryCarousel categories={mockCategories} />);
    const nextBtn = screen.getByRole("button", { name: /next category/i });
    await userEvent.click(nextBtn);
    const activeTab = screen
      .getAllByRole("tab")
      .find((tab) => tab.getAttribute("aria-selected") === "true");
    expect(activeTab).toHaveTextContent("Pensions");
  });

  it("navigates to previous category on prev button click", async () => {
    render(<CategoryCarousel categories={mockCategories} />);
    const prevBtn = screen.getByRole("button", { name: /previous category/i });
    await userEvent.click(prevBtn);
    const activeTab = screen
      .getAllByRole("tab")
      .find((tab) => tab.getAttribute("aria-selected") === "true");
    expect(activeTab).toHaveTextContent("ISAs");
  });

  it("disables prev button when on first category", async () => {
    render(<CategoryCarousel categories={mockCategories} />);
    const prevBtn = screen.getByRole("button", { name: /previous category/i });
    await userEvent.click(prevBtn); // go to ISAs
    expect(prevBtn).toBeDisabled();
  });

  it("disables next button when on last category", async () => {
    render(<CategoryCarousel categories={mockCategories} />);
    const nextBtn = screen.getByRole("button", { name: /next category/i });
    await userEvent.click(nextBtn); // go to Pensions
    expect(nextBtn).toBeDisabled();
  });
});
