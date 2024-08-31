import fetchAPI from "@/helpers/fetchAPI";
import useFetchData from "@/hooks/useFetchData";
import { PuzzleAndCharacters, SelectionMenuProps, ValidationResponse } from "@/types";
import { useEffect, useReducer, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import Loader from "../ui/Loader";
import puzzleReducer from "@/helpers/puzzleReducer";

const initialState = {
  square: {display: false, x: 0, y: 0},
  coordinates: {x: 0, y: 0},
  foundCharacters: [],
  checks: [],
  timer: 0,
  timerActive: false,
  showModal: false,
  showToast: false,
}

const Puzzle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [puzzle, error, loading] = useFetchData<PuzzleAndCharacters>({url: `/api/v1/${location.pathname}`});
  const puzzleImage = useRef<HTMLImageElement>(null);
  const [state, dispatch] = useReducer(puzzleReducer, initialState);
  const {timer, timerActive, gameId, square, foundCharacters, showModal, modalProps, showToast, checks} = state;

  useEffect(() => {
    const getGame = async () => {
      const gameId = await fetchAPI<string>({url: `/api/v1/games/${location.pathname.split("/")[2]}`});
      dispatch({type: "loadPuzzle", gameId: gameId});
    };

    getGame();
  }, [location.pathname]);

  useEffect(() => {
    if (!timerActive) return;
    const intervalId = setInterval(() => {
      dispatch({type: "startTimer"});
    }, 99);
    return () => clearInterval(intervalId);
  }, [timerActive]);

  useEffect(() => {
    if (!showToast) return;
    const timeout = setTimeout(() => dispatch({type: "closeToast"}), 2000);
    return () => clearTimeout(timeout);
  }, [showToast]);

  const validateSelection = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (!(e.target instanceof HTMLElement)) return;
    const name = e.target.textContent;
    const getValidation = async () => {
      const data = await fetchAPI<ValidationResponse>({url: `/api/v1/games/${gameId}`, options: {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, x: state.coordinates.x, y: state.coordinates.y})
      }});
      if (!data?.game) return;
      dispatch({type: "selectCharacter", selectionData: data})
    };
    getValidation();
  };

  if (error) return <p>Something went wrong. Please try again later.</p>;

  if (loading) return <Loader />;

  return (
    <>
      <h2 className="text-2xl text-center mb-4">{puzzle?.puzzle.name}</h2>
      <p className="text-xl">Wanted characters:</p>
      <div className="controls sticky top-0 bg-background py-4 z-10">
        <div className="characters my-2 border rounded-lg flex gap-4 justify-around px-1">
          {!error && !loading && puzzle?.characters.map(character => (
            <div key={character.id}
              className={`character flex md:gap-4 items-center ${foundCharacters.includes(character.id) && "line-through text-slate-400"}`}
            >
              <div className="max-w-16 md:max-w-32 relative">
                <img className={`aspect-square object-contain ${puzzle.puzzle.id === 1 && "scale-90 md:object-none"} ${character.id === 2 ? "object-[50%_15%] -translate-x-2 md:-translate-x-6" : "object-top"}`} src={character.image_url} alt={character.name} />
                {foundCharacters.includes(character.id) && <div className="absolute inset-0 text-center text-green-400 font-bold text-[3.5rem] md:text-[140px] -translate-y-4 md:-translate-y-8">&#10003;</div>}
              </div>
              <p>{character.name}</p>
            </div>
          ))}
        </div>
        <p className="timer text-xl font-semibold text-center">{timer.toFixed(3)} s</p>
        { !timerActive &&
          <div className="flex justify-center gap-4 items-center text-center my-4">
            <button className=" border border-primary rounded-md px-4 py-2 w-36 transition-transform hover:scale-105" onClick={() => navigate(0)}>Play Again</button>
            <Link to="/" className="border border-accent bg-accent rounded-md px-4 py-2 w-36 transition-transform hover:scale-105">More Puzzles</Link>
          </div>
        }
      </div>
      <div className="relative">
        <img ref={puzzleImage} className="mb-4 rounded-md hover:cursor-cell w-full" onClick={e => dispatch({type: "clickImage", event: e})}
          src={puzzle?.puzzle.image_url} alt={`${puzzle?.puzzle.name} puzzle`}
        />
        {
          checks.length > 0 && checks.map((check, i) => <div key={i} className={`absolute text-center text-green-400 font-bold leading-[130px] text-4xl md:text-[4rem] -translate-x-1/2 -translate-y-1/2`} style={{left: check.x * (puzzleImage.current?.offsetWidth || 1), top: check.y * (puzzleImage.current?.offsetHeight || 1)}}>&#10003;</div>)
        }
      </div>
      { square.display && <SelectionMenu characters={puzzle?.characters?.filter(char => !foundCharacters.includes(char.id)).map(char => char.name) || []} x={square.x} y={square.y}
        validateSelection={validateSelection} dispatch={dispatch}/>}
      <div className={`fixed flex text-nowrap flex-wrap gap-1 leading-4 right-2 md:right-8 bottom-4 md:bottom-8 border border-foreground bg-background rounded max-w-max w-full py-2 md:py-4 pl-10 pr-4 transition-transform ${showToast ? "translate-x-0" : "translate-x-[150%]"}`}>
        <span>That character isn't there.</span>
        <span>Keep trying!</span>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">&#10006;</span>
      </div>
      <Modal gameDuration={modalProps?.gameDuration} highscores={modalProps?.highscores} index={modalProps?.index} gameId={gameId} dispatch={dispatch} visible={showModal} />
    </>
  );
};

const SelectionMenu = ({characters, x, y, validateSelection, dispatch}: SelectionMenuProps) => {
  return (
    <div className="absolute inset-0" onClick={() => dispatch({type: "closeSelectionMenu"})}>
      <div className="absolute -translate-x-3 -translate-y-3 md:-translate-x-6 md:-translate-y-6" style={{left: x, top: y}}>
        <div className="w-6 md:w-12 aspect-square border-4 border-black border-dashed"></div>
        <ul className="bg-white rounded list-none" role="menu">
          {characters.map((character, i) =>
            <li key={i} className="px-4 py-2 hover:cursor-pointer rounded hover:bg-blue-100" onClick={validateSelection} role="menuitem">{character}</li>)
          }
        </ul>
      </div>
    </div>
  );
};

export default Puzzle;