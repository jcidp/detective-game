import { useState } from "react";
import { ModalProps, UpdateUserResponse } from "../../types";
import fetchAPI from "@/helpers/fetchAPI";


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

export default Modal;