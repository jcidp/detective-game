const Game = () => {
  return (
    <>
      <h2 className="text-2xl text-center mb-4">Test Game</h2>
      <p className="text-xl">Find these characters:</p>
      <div className="controls">
        <div className="characters my-2 border rounded-lg flex justify-around">
          <div className="character flex gap-4">
            <div className="img">M</div>
            <p>Character 1 Name</p>
          </div>
          <div className="character flex gap-4">
            <div className="img">M</div>
            <p>Character 2 Name</p>
          </div>
          <div className="character flex gap-4">
            <div className="img">M</div>
            <p>Character 3 Name</p>
          </div>
        </div>
        <p className="timer text-xl font-semibold text-center">00:00:01</p>
      </div>
      <img className="my-8 hover:cursor-cell"
        src="https://i.pinimg.com/originals/6f/c8/b6/6fc8b6b6730f8ac917a21c1ccc6ae2f7.jpg" alt="Where's Waldo game"
      />
    </>
  );
};

export default Game;