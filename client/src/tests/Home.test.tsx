import Home from "@/components/pages/Home";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const {mockedUseFetchData, mockedLink, mockedLoader} = vi.hoisted(() => ({
  mockedUseFetchData: vi.fn(),
  mockedLink: vi.fn(),
  mockedLoader: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  Link: mockedLink,
}));

vi.mock("@/hooks/useFetchData", () => ({
  default: mockedUseFetchData,
}));

vi.mock("@/components/ui/Loader", () => ({
  default: mockedLoader,
}));

describe("Home page", () => {
  mockedLoader.mockImplementation(() => <p>Loading...</p>);
  mockedLink.mockImplementation(({children}) => <a role="link">{children}</a>);

  it("renders an error message when fetch returns error", () => {
    mockedUseFetchData.mockReturnValue([
      [],
      Error("Mocked error"),
      false
    ]);

    render(<Home />);

    expect(screen.getByText("Something went wrong. Please try again later.")).toBeInTheDocument();
  });

  it("renders the Loader while waiting for a response", () => {
    mockedUseFetchData.mockReturnValue([
      [],
      null,
      true
    ]);

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the fetched puzzles", () => {
    mockedUseFetchData.mockReturnValue([
      [
        {
          id: 1,
          name: "test",
          description: "description",
          image_url: "fake_url",
        }
      ],
      null,
      false
    ]);

    render(<Home />);

    expect(screen.getAllByRole("link").length).toBe(1);
    expect(screen.getByRole("heading", {name: "test"})).toBeInTheDocument();
  })
});