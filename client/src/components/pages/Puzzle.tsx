import fetchAPI from "@/helpers/fetchAPI";
import useFetchData from "@/hooks/useFetchData";
import { ModalProps, PuzzleAndCharacters, SelectionMenuProps, ValidationResponse } from "@/types";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";

const Puzzle = () => {
  const location = useLocation();
  const [puzzle, error, loading] = useFetchData<PuzzleAndCharacters>({url: `/api/v1/${location.pathname}`});
  const [square, setSquare] = useState({display: false, x: 0, y: 0});
  const [coordinates, setCoordinates] = useState({x: 0, y: 0});
  const [gameId, setGameId] = useState<string | undefined>();
  const [foundCharacters, setFoundCharacters] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showToast, setShowToast] = useState<NodeJS.Timeout|undefined>();
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>();
  const navigate = useNavigate();

  useEffect(() => {
    const getGame = async () => {
        const gameId = await fetchAPI<string>({url: `/api/v1/games/${location.pathname.split("/")[2]}`});
        setGameId(gameId);
        setTimerActive(true);
    };

    getGame();
  }, [location.pathname]);

  useEffect(() => {
    if (!timerActive) return;
    const intervalId = setInterval(() => {
      setTimer(t => t + 0.099);
    }, 99);
    return () => clearInterval(intervalId);
  }, [timerActive]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!(e.target instanceof HTMLElement)) return;
    const x = e.pageX - (e.target.offsetLeft || 0);
    const y = e.pageY - (e.target.offsetTop || 0);
    const x_percent = Math.round(x / e.target.offsetWidth * 1000) / 1000;
    const y_percent = Math.round(y / e.target.offsetHeight * 1000) / 1000;
    setSquare({display: true, x: e.pageX, y: e.pageY});
    setCoordinates({x: x_percent, y: y_percent});
  };

  const validateSelection = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    if (!(e.target instanceof HTMLElement)) return;
    console.log(`Validating ${e.target.textContent} at ${coordinates.x}, ${coordinates.y}`);
    const name = e.target.textContent;
    const getValidation = async () => {
      const data = await fetchAPI<ValidationResponse>({url: `/api/v1/games/${gameId}`, options: {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, x: coordinates.x, y: coordinates.y})
      }});
      const game = data?.game;
      if (!game) return;
      const foundIds = game.characters_found
      setFoundCharacters(foundIds);
      if (data.highscores?.length) return handleGameOver(data);
      if (JSON.stringify(foundIds) === JSON.stringify(foundCharacters)) handleShowToast();
    };
    getValidation();
  };

  const handleGameOver = ({game, highscores, index}: ValidationResponse) => {
    setTimerActive(() => false);
    const game_duration = ((new Date(game.end_time).getTime()) - (new Date(game.created_at).getTime())) / 1000;
    setTimer(game_duration);
    setModalProps({game_duration, highscores, index});
    setShowModal(true);
  };

  const closeBackdrop = () => {
    setSquare({...square, display: false})
  };

  const handleShowToast = () => {
    if (showToast) clearTimeout(showToast);
    const timeout = setTimeout(() => setShowToast(undefined), 2000);
    setShowToast(() => timeout);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <h2 className="text-2xl text-center mb-4">Test Puzzle</h2>
      <p className="text-xl">Find these characters:</p>
      <div className="controls sticky top-0 bg-background py-4">
        <div className="characters my-2 border rounded-lg flex justify-around">
          {!error && !loading && puzzle?.characters.map(character => (
            <div key={character.id}
              className={`character flex gap-4 items-center ${foundCharacters.includes(character.id) && "line-through text-slate-400"}`}
            >
              <div className="max-w-32 relative">
                <img className={`aspect-square object-${puzzle.puzzle.id === 1 ? "none" : "contain"} ${character.id === 2 ? "object-[50%_15%] -translate-x-6" : "object-top"}`} src={character.image_url} alt={character.name} />
                {foundCharacters.includes(character.id) && <div className="absolute inset-0 text-center text-green-400 font-bold leading-[130px] text-[140px]">&#10003;</div>}
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
      <img className="my-8 rounded-md hover:cursor-cell ms-auto me-auto" onClick={handleImageClick}
        src={puzzle?.puzzle.image_url} alt={`${puzzle?.puzzle.name} puzzle`}
      />
      { square.display && <SelectionMenu characters={puzzle?.characters?.filter(char => !foundCharacters.includes(char.id)).map(char => char.name) || []} x={square.x} y={square.y}
        validateSelection={validateSelection} closeBackdrop={closeBackdrop}/>}
      <div className={`fixed right-8 bottom-8 border border-foreground bg-background rounded max-w-[420px] w-full p-4 transition-transform ${showToast ? "translate-x-0" : "translate-x-[150%]"}`}>
        <p>That character isn't there. Keep trying!</p>
      </div>
      { showModal && <Modal game_duration={modalProps?.game_duration} highscores={modalProps?.highscores} index={modalProps?.index} gameId={gameId} closeModal={closeModal} />}
    </>
  );
};

const SelectionMenu = ({characters, x, y, validateSelection, closeBackdrop}: SelectionMenuProps) => {
  return (
    <div className="absolute inset-0" onClick={closeBackdrop}>
      <div className="absolute" style={{left: x - 24, top: y - 24}}>
        <div className="w-12 aspect-square border-4 border-black border-dashed"></div>
        <li className="bg-white rounded list-none">
          {characters.map((character, i) =>
            <ul key={i} className="px-4 py-2 hover:cursor-pointer rounded hover:bg-blue-100" onClick={validateSelection}>{character}</ul>)
          }
        </li>
      </div>
    </div>
  );
};

export default Puzzle;