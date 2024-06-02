import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useFetchData from "@/hooks/useFetchData";
import { PuzzleI } from "@/types";
import { Link } from "react-router-dom";

const Home = () => {
  const [puzzles, error, loading] = useFetchData<PuzzleI[]>({url: "/api/v1/puzzles"});

  if (error) return <p>Something went wrong. Please try again later.</p>

  return (
    <>
      <div className="intro text-2xl text-center my-4">
        <p className="my-4">Find the selected characters in the picture as fast as you can!</p>
        <p>When you find one, click on it and select the character.</p>
      </div>
      <div className="games mt-8 grid grid-cols-3">
        {
          loading ? <p>Loading...</p> :
          puzzles?.map(puzzle => {
            return (
              <Link to={`puzzles/${puzzle.name}`} key={puzzle.name} >
                <Card>
                  <CardHeader>
                    <CardTitle>{puzzle.name.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</CardTitle>
                    <CardDescription>Description placeholder text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Image Placeholder
                  </CardContent>
                </Card>
              </Link>
            );
          })
        }
      </div>
    </>
  );
};

export default Home;