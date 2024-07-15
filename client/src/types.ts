interface FetchProps {
  url: string;
  options?: {
    method: string;
    headers: {[header: string]: string};
    body: string;
  }
}

interface Character {
  id: number;
  name: string;
  image_url: string;
}

interface PuzzleI {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface PuzzleAndCharacters {
  puzzle: PuzzleI
  characters: Character[];
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

interface SelectionMenuProps {
  characters: string[];
  x: number;
  y: number;
  validateSelection: (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => void;
  dispatch: React.Dispatch<reducerAction>;
}

interface ModalProps {
  gameDuration?: number;
  highscores?: Game[];
  index?: number | null;
  gameId?: string;
  dispatch: React.Dispatch<reducerAction>;
  visible?: boolean;
}

interface UpdateUserResponse {
  status: "Success" | "Error"
}

interface Check {
  x: number
  y: number
}

interface reducerAction {
  type: "loadPuzzle" | "startTimer" | "clickImage" | "selectCharacter" | "closeSelectionMenu" | "closeModal" | "closeToast";
  event?: React.MouseEvent<HTMLImageElement, MouseEvent> | React.MouseEvent<HTMLUListElement, MouseEvent>;
  gameId?: string;
  selectionData?: ValidationResponse;
}

interface reducerState {
  square: {
    display: boolean;
    x: number;
    y: number;
  },
  coordinates: {
    x: number;
    y: number;
  },
  foundCharacters: number[];
  checks: Check[];
  timer: number;
  timerActive: boolean;
  gameId?: string;
  modalProps?: Omit<ModalProps, "dispatch">;
  showModal: boolean;
  showToast: boolean;
}

export type {FetchProps, PuzzleI, PuzzleAndCharacters, ValidationResponse, SelectionMenuProps, ModalProps, UpdateUserResponse, Check, reducerAction, reducerState}