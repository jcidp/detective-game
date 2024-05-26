import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";

const charactersOptions = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({puzzle_name: "Where's Waldo?"})
};

interface Character {
  id: number;
  name: string;
  image_url: string;
  x_range: number[];
  y_range: number[];
  puzzle_id: number;
}

const Puzzle = () => {
  const [characters, error, loading] = useFetchData<Character[]>({url: "/api/v1/characters/puzzle", options: charactersOptions});
  const [square, setSquare] = useState({display: false, x: 0, y: 0});
  const [coordinates, setCoordinates] = useState({x: 0, y: 0});


  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!(e.target instanceof HTMLElement)) return;
    const x = e.pageX - (e.target.offsetLeft || 0);
    const y = e.pageY - (e.target.offsetTop || 0);
    const x_percent = Math.round(x / e.target.offsetWidth * 1000) / 1000;
    const y_percent = Math.round(y / e.target.offsetHeight * 1000) / 1000;
    // console.log(`x: ${x}, y: ${y}`);
    // console.log(`x_percent: ${x_percent}, y_percent: ${y_percent}`);
    setSquare({display: true, x: e.pageX, y: e.pageY});
    setCoordinates({x: x_percent, y: y_percent});
  };

  const validateSelection = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    if (!(e.target instanceof HTMLElement)) return;
    console.log(`Validating ${e.target.textContent} at ${coordinates.x}, ${coordinates.y}`);
    // console.log(`Validation result: ${validationResult}`);
  };

  const closeBackdrop = () => {
    setSquare({...square, display: false})
  };

  return (
    <>
      <h2 className="text-2xl text-center mb-4">Test Puzzle</h2>
      <p className="text-xl">Find these characters:</p>
      <div className="controls">
        <div className="characters my-2 border rounded-lg flex justify-around">
          {!error && !loading && characters && characters.map(character => (
            <div key={character.id} className="character flex gap-4">
              <img src={character.image_url} alt={character.name} />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
        <p className="timer text-xl font-semibold text-center">00:00:01</p>
      </div>
      <img className="my-8 hover:cursor-cell" onClick={handleImageClick}
        src="https://i.pinimg.com/originals/6f/c8/b6/6fc8b6b6730f8ac917a21c1ccc6ae2f7.jpg" alt="Where's Waldo Puzzle"
      />
      { square.display && <SelectionMenu characters={["Waldo", "Wizard", "Chef"]} x={square.x} y={square.y}
        validateSelection={validateSelection} closeBackdrop={closeBackdrop}/>}
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

export default Puzzle;