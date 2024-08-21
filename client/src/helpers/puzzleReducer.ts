import { reducerAction, reducerState } from "@/types";

export default function puzzleReducer(state: reducerState, action: reducerAction): reducerState {
  switch (action.type) {
    case "loadPuzzle": {
      if (!action.gameId) break;
      return {...state, gameId: action.gameId, timerActive: true};
    }

    case "startTimer": {
      return {...state, timer: state.timer + 0.099};
    }

    case "clickImage": {
      const e = action.event;
      if (!e || !(e.target instanceof HTMLElement)) break;
      const parent = e.target.parentElement;
      if (!(parent instanceof HTMLElement)) break;
      const x = e.pageX - (parent.offsetLeft || 0);
      const y = e.pageY - (parent.offsetTop || 0);
      const x_percent = Math.round(x / e.target.offsetWidth * 1000) / 1000;
      const y_percent = Math.round(y / e.target.offsetHeight * 1000) / 1000;
      return {...state, square: {display: true, x: e.pageX, y: e.pageY}, coordinates: {x: x_percent, y: y_percent}};
    }

    case "selectCharacter": {
      const data = action.selectionData;
      const foundIds = data?.game.characters_found;
      if (!foundIds) break;
      const correctSelection = JSON.stringify(foundIds) !== JSON.stringify(state.foundCharacters);
      const gameOver = !!data.highscores?.length;
      const gameDuration = gameOver ? ((new Date(data.game.end_time).getTime()) - (new Date(data.game.created_at).getTime())) / 1000 : 0;
      return {
        ...state,
        foundCharacters: foundIds,
        showToast: !correctSelection,
        checks: correctSelection ? [...state.checks, {x: state.coordinates.x, y: state.coordinates.y}] : state.checks,
        timer: gameOver ? gameDuration : state.timer,
        timerActive: !gameOver,
        showModal: gameOver,
        modalProps: gameOver ? {gameDuration, highscores: data.highscores, index: data.index} : undefined
      }
    }

    case "closeSelectionMenu": {
      return {...state, square: {...state.square, display: false}};
    }

    case "closeModal": {
      return {...state, showModal: false};
    }

    case "closeToast": {
      return {...state, showToast: false};
    }
  }
  
  return state;
}
