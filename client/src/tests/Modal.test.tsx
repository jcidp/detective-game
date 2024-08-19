import Modal from "@/components/ui/Modal";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

const mockedFetchAPI = vi.hoisted(() => vi.fn());

vi.mock("@/helpers/fetchAPI", () => ({
  default: mockedFetchAPI,
}));

describe("Modal UI component", () => {
  it("is not visible when 'visible' is false", () => {
    render(<Modal dispatch={() => {}} />);

    expect(screen.getByText("You found everyone, great job!")).not.toBeVisible();
    expect(screen.getByRole("presentation")).not.toBeVisible();
  });

  it("displays the game duration when the modal is visible", () => {
    render(<Modal gameDuration={10} visible={true} dispatch={() => {}} />);

    expect(screen.getByText("Your time: 10 s")).toBeVisible();
    expect(screen.queryByText("You made it to the top ten!")).not.toBeInTheDocument();
    expect(screen.getByRole("presentation")).toBeVisible();
  });

  it("renders a message if you made it to the top ten", () => {
    render(<Modal gameDuration={10} index={1} visible={true} dispatch={() => {}} />)

    expect(screen.getByText("You made it to the top ten!")).toBeInTheDocument();
  });

  it("lets users input their valid name", async () => {
    mockedFetchAPI.mockReturnValue({status: "Success"});
    const user = userEvent.setup();

    render(<Modal gameDuration={10} index={1} visible={true} dispatch={() => {}} />);
    const btn = screen.getByRole("button", {name: "Save"});

    expect(btn).toBeInTheDocument();

    await user.keyboard("test");
    await user.click(btn);

    expect(screen.queryByRole("button", {name: "Save"})).not.toBeInTheDocument();
  });

  it("doesn't accept an invalid username", async () => {
    mockedFetchAPI.mockReturnValue({status: "Success"});
    const user = userEvent.setup();

    render(<Modal gameDuration={10} index={1} visible={true} dispatch={() => {}} />);
    const btn = screen.getByRole("button", {name: "Save"});

    expect(btn).toBeInTheDocument();

    await user.keyboard(" ad   ");
    await user.click(btn);

    expect(screen.queryByRole("button", {name: "Save"})).toBeInTheDocument();
  });

  it("displays returned highscores and calculates their game duration", () => {
    const highscores = [
      {
        created_at: "2024-01-01T00:01:00",
        end_time: "2024-01-01T00:01:30",
        username: "Test1",
        characters_found: [],
      },
      {
        created_at: "2024-01-01T00:02:00",
        end_time: "2024-01-01T00:02:32",
        username: "Test2",
        characters_found: [],
      },
      {
        created_at: "2024-01-01T00:03:00",
        end_time: "2024-01-01T00:03:33",
        username: "Test3",
        characters_found: [],
      },
    ];

    render(<Modal gameDuration={10} index={1} visible={true} highscores={highscores} dispatch={() => {}} />);
    
    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getAllByRole("row")[0].lastElementChild?.textContent).toBe("30.000 s");
  });

  it("calls the function to close the modal with the closeModal action", async () => {
    const user = userEvent.setup();
    const mockedDispatch = vi.fn();

    render(<Modal dispatch={mockedDispatch} visible={true} />);

    await user.click(screen.getByRole("presentation"));

    expect(mockedDispatch).toHaveBeenCalledTimes(1);
  });
});
