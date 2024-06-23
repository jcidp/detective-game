import useFetchData from "@/hooks/useFetchData";
import { PuzzleI } from "@/types";
import { Link } from "react-router-dom";

const Home = () => {
  const [puzzles, error, loading] = useFetchData<PuzzleI[]>({url: "/api/v1/puzzles"});

  if (error) return <p>Something went wrong. Please try again later.</p>

  return (
    <>
      <div className="intro text-2xl text-center my-4">
        <p className="my-4">Find the wanted characters in the picture as fast as you can!</p>
        <p>When you spot one, click on them to identify them.</p>
      </div>
      <div className="games my-8 grid md:grid-cols-3 gap-4 auto-rows-fr">
        {
          loading ? <p>Loading...</p> :
          puzzles?.map(puzzle => {
            return (
              <Link to={`puzzles/${puzzle.id}`} key={puzzle.id} >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">{puzzle.name}</h2>
                    <p className="text-sm text-muted-foreground">{puzzle.description}</p>
                  </div>
                </div>
              </Link>
            );
          })
        }
      </div>
    </>
  );
};

export default Home;