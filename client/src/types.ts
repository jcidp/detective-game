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
  closeBackdrop: () => void;
}

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

export type {FetchProps, PuzzleI, PuzzleAndCharacters, ValidationResponse, SelectionMenuProps, ModalProps, UpdateUserResponse}