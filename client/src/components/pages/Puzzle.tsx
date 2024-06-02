import fetchAPI from "@/helpers/fetchAPI";
import useFetchData from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const charactersOptions = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({puzzle_name: "Where's Waldo?"})
};

interface Character {
  id: number;
  name: string;
  image_url: string;
}

interface Game {
  created_at: string;
  end_time: string;
  username: string;
  characters_found: number[];
}

interface ValidationResponse {
  game: Game;
  highscores?: Game[];
  index?: number;
}

const Puzzle = () => {
  const [characters, error, loading] = useFetchData<Character[]>({url: "/api/v1/characters/puzzle", options: charactersOptions});
  const [square, setSquare] = useState({display: false, x: 0, y: 0});
  const [coordinates, setCoordinates] = useState({x: 0, y: 0});
  const [gameId, setGameId] = useState<string | undefined>();
  const [foundCharacters, setFoundCharacters] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>();
  const navigate = useNavigate();

  useEffect(() => {
    const getGame = async () => {
        const gameId = await fetchAPI<string>({url: "/api/v1/games", options: charactersOptions});
        setGameId(gameId);
        setTimerActive(true);
    };

    getGame();
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const intervalId = setInterval(() => {
      setTimer(t => t + 0.01);
    }, 10);
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
      if (characters?.every(char => foundIds.includes(char.id))) return handleGameOver(data);
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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <h2 className="text-2xl text-center mb-4">Test Puzzle</h2>
      <p className="text-xl">Find these characters:</p>
      <div className="controls">
        <div className="characters my-2 border rounded-lg flex justify-around">
          {!error && !loading && characters && characters.map(character => (
            <div key={character.id}
              className={`character flex gap-4 ${foundCharacters.includes(character.id) && "line-through text-slate-400"}`}
            >
              <img src={character.image_url} alt={character.name} />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
        <p className="timer text-xl font-semibold text-center">{timer.toFixed(3)}</p>
        { !timerActive &&
          <div className="flex justify-center gap-4 items-center text-center my-4">
            <button className=" border border-primary rounded-md px-4 py-2 w-36 transition-transform hover:scale-105" onClick={() => navigate(0)}>Play Again</button>
            <Link to="/" className="border border-accent bg-accent rounded-md px-4 py-2 w-36 transition-transform hover:scale-105">More Puzzles</Link>
          </div>
        }
      </div>
      <img className="my-8 hover:cursor-cell" onClick={handleImageClick}
        src="https://i.pinimg.com/originals/6f/c8/b6/6fc8b6b6730f8ac917a21c1ccc6ae2f7.jpg" alt="Where's Waldo Puzzle"
      />
      { square.display && <SelectionMenu characters={characters?.filter(char => !foundCharacters.includes(char.id)).map(char => char.name) || []} x={square.x} y={square.y}
        validateSelection={validateSelection} closeBackdrop={closeBackdrop}/>}
      <div className={`fixed right-8 bottom-8 border border-foreground bg-background rounded max-w-[420px] w-full p-4 transition-transform ${showToast ? "translate-x-0" : "translate-x-[150%]"}`}>
        <p>That character isn't there. Keep trying!</p>
      </div>
      { showModal && <Modal game_duration={modalProps?.game_duration} highscores={modalProps?.highscores} index={modalProps?.index} gameId={gameId} closeModal={closeModal} />}
    </>
  );
};

interface SelectionMenuProps {
  characters: string[];
  x: number;
  y: number;
  validateSelection: (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => void;
  closeBackdrop: () => void;
}

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
  )
};

interface ModalProps {
  game_duration?: number;
  highscores?: Game[];
  index?: number | null;
  gameId?: string;
  closeModal?: () => void;
}

interface UpdateUserResponse {
  status: "Success" | "Error"
}

const Modal = ({game_duration, highscores, index, gameId, closeModal}: ModalProps) => {
  const [username, setUsername] = useState("");
  const [showInput, setShowInput] = useState(true);

  const saveUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || username.length < 3 && username.length > 18) return;
    const updateUsername = async () => {
      const response = await fetchAPI<UpdateUserResponse>({url: `/api/v1/games/${gameId}/username`, options: {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: username})
      }});
      if ( response?.status === "Success" ) setShowInput(false);
    };
    updateUsername();
  };

  return (
    <>
      <div className="fixed bg-black opacity-40 inset-0" onClick={closeModal}></div>
      <div className="fixed bg-background top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md grid place-content-center w-1/2 py-8 leading-10 text-center">
        <p>You found everyone, great job!</p>
        <p>Your time: {game_duration} s</p>
        { typeof index === "number" && 
          <div>
            <p>Congratulations on making it to the top ten!</p>
            <p>Type your username so we can add you to the highscores</p>
          </div>
        }
        { typeof index === "number" && showInput &&
          <form className="flex justify-center gap-4" onSubmit={saveUsername}>
            <input className="border border-primary px-2 leading-8 rounded" autoFocus placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username} minLength={3} maxLength={18} />
            <button>Save</button>
          </form>
        }
        <p className="font-bold mt-4">Highscores</p>
        <div className="mb-4">
          {highscores?.map((game, i) => (
            <div key={i} className={`grid grid-cols-3 ${i === index && "bg-accent rounded"}`}>
              <span>{i + 1}</span>
              {i === index ?
                <span className="bg-accent">{username}</span> :
                <span>{game.username}</span>}
              <span>{(((new Date(game.end_time).getTime()) - (new Date(game.created_at).getTime())) / 1000).toFixed(3)} s</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Puzzle;