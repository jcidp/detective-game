import Puzzle from "@/components/pages/Puzzle";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const {mockedFetchAPI, mockedUseFetchData, mockedLink, mockedUseLocation, mockedUseNavigate, mockedModal, mockedLoader} = vi.hoisted(() => ({
  mockedFetchAPI: vi.fn(),
  mockedUseFetchData: vi.fn(),
  mockedLink: vi.fn(),
  mockedUseLocation: vi.fn(),
  mockedUseNavigate: vi.fn(),
  mockedModal: vi.fn(),
  mockedLoader: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  Link: mockedLink,
  useLocation: mockedUseLocation,
  useNavigate: mockedUseNavigate,
}));

vi.mock("@/helpers/fetchAPI", () => ({
  default: mockedFetchAPI,
}));

vi.mock("@/hooks/useFetchData", () => ({
  default: mockedUseFetchData,
}));

vi.mock("@/components/ui/Modal", () => ({
  default: mockedModal,
}));

vi.mock("@/components/ui/Loader", () => ({
  default: mockedLoader,
}));

describe("Puzzle page component", () => {
  mockedLink.mockImplementation(({children}) => <a role="link">{children}</a>);
  mockedUseLocation.mockImplementation(() => ({pathname: ""}));
  mockedUseNavigate.mockImplementation(() => {});
  mockedModal.mockImplementation(() => <div>Modal</div>);
  mockedLoader.mockImplementation(() => <p>Loading...</p>);
  mockedFetchAPI.mockReturnValue("uuid");

  const validPuzzleAndCharacters = {
    puzzle: {
      id: 1,
      name: "test",
      description: "description",
      image_url: "fake url",
    },
    characters: [{id: 1, name: "test char", image_url: "char url"}]
  };

  const fakeGame = {
    created_at: "2024-01-01T00:01:00",
    end_time: "2024-01-01T00:02:00",
    username: "",
    characters_found: [1],
  };
  
  it("renders error message when puzzle fetching fails", async () => {
    mockedUseFetchData.mockReturnValue([
      undefined,
      Error("Test error"),
      false,
    ]);

    await act(async () => {
      render(<Puzzle />);
    });

    expect(screen.getByText("Something went wrong. Please try again later.")).toBeInTheDocument();
  });

  it("renders Loader when waiting to fetch puzzle data", async () => {
    mockedUseFetchData.mockReturnValue([
      undefined,
      null,
      true,
    ]);

    await act(async () => {
      render(<Puzzle />);
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the fetched puzzle", async () => {
    mockedUseFetchData.mockReturnValue([
      validPuzzleAndCharacters,
      null,
      false,
    ]);

    await act(async () => {
      render(<Puzzle />);
    });

    expect(screen.getByAltText(`${validPuzzleAndCharacters.puzzle.name} puzzle`)).toBeInTheDocument()
  });

  it("displays selection menu when clicking image", async () => {
    mockedUseFetchData.mockReturnValue([
      validPuzzleAndCharacters,
      null,
      false,
    ]);
    const user = userEvent.setup();

    await act(async () => {
      render(<Puzzle />);
    });

    expect(screen.queryByRole("menuitem", {name: "test char"})).not.toBeInTheDocument();

    await user.click(screen.getByAltText(`${validPuzzleAndCharacters.puzzle.name} puzzle`));
    
    expect(screen.getByRole("menuitem", {name: "test char"})).toBeInTheDocument();
  });

  it("shows modal when finding all characters", async () => {
    mockedUseFetchData.mockReturnValue([
      validPuzzleAndCharacters,
      null,
      false,
    ]);
    mockedFetchAPI.mockReturnValueOnce("uuid");
    mockedFetchAPI.mockReturnValueOnce({
      game: fakeGame,
      highscores: [fakeGame],
      index: 0
    });
    const user = userEvent.setup();

    await act(async () => {
      render(<Puzzle />);
    });

    await user.click(screen.getByAltText(`${validPuzzleAndCharacters.puzzle.name} puzzle`));
    await user.click(screen.getByRole("menuitem", {name: "test char"}));
    
    expect(mockedModal.mock.lastCall[0].visible).toBe(true);
  });

  it("does NOT show modal when NOT finding all characters", async () => {
    mockedUseFetchData.mockReturnValue([
      validPuzzleAndCharacters,
      null,
      false,
    ]);
    mockedFetchAPI.mockReturnValueOnce("uuid");
    mockedFetchAPI.mockReturnValue({
      game: fakeGame,
      highscores: [],
      index: 0
    });
    const user = userEvent.setup();

    await act(async () => {
      render(<Puzzle />);
    });

    await user.click(screen.getByAltText(`${validPuzzleAndCharacters.puzzle.name} puzzle`));
    await user.click(screen.getByRole("menuitem", {name: "test char"}));
    
    expect(mockedModal.mock.lastCall[0].visible).toBe(false);
  });
});