import { useState } from "react";
import { ModalProps, UpdateUserResponse } from "../../types";
import fetchAPI from "@/helpers/fetchAPI";


const Modal = ({gameDuration, highscores, index, gameId, dispatch, visible}: ModalProps) => {
  const [username, setUsername] = useState("");
  const [showInput, setShowInput] = useState(true);

  const saveUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username);
    if (!username.trim() || username.trim().length < 3 || username.trim().length > 12) return;
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
      <div className={`fixed bg-black z-20 ${visible ? "opacity-40" : "opacity-0 pointer-events-none"} inset-0 transition-opacity duration-300`} onClick={() => dispatch({type: "closeModal"})} role="presentation"></div>
      <div className={`fixed bg-background top-1/2 left-1/2 z-20 -translate-x-1/2 ${visible ? "-translate-y-1/2 opacity-100" : "-translate-y-[200vh] opacity-0"} rounded-md grid place-content-center w-11/12 md:w-1/2 px-2 py-2 md:py-8 leading-10 text-center transition-transform duration-300`}>
        <p>You found everyone, great job!</p>
        <p>Your time: {gameDuration} s</p>
        { typeof index === "number" && 
          <div>
            <p>You made it to the top ten!</p>
            <p>Type your username to save your score</p>
          </div>
        }
        { typeof index === "number" && showInput &&
          <form className="flex justify-center gap-1 md:gap-4" onSubmit={saveUsername}>
            <input className="border border-primary px-2 leading-8 rounded" autoFocus placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username} minLength={3} maxLength={12} />
            <button>Save</button>
          </form>
        }
        <p className="font-bold mt-4">Highscores</p>
        <table className="mb-4">
          <tbody>
            {highscores?.map((game, i) => (
              <tr key={i} className={`grid grid-cols-3 ${i === index && "bg-accent rounded"}`}>
                <td>{i + 1}</td>
                {i === index ?
                  <td className="bg-accent">{username}</td> :
                  <td>{game.username}</td>
                }
                <td>{(((new Date(game.end_time).getTime()) - (new Date(game.created_at).getTime())) / 1000).toFixed(3)} s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Modal;