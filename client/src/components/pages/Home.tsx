import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="intro text-2xl text-center my-4">
        <p className="my-4">Find the selected characters in the picture as fast as you can!</p>
        <p>When you find one, click on it and select the character.</p>
      </div>
      <div className="games mt-8 grid grid-cols-3">
        <Link to="game/test">
          <Card>
            <CardHeader>
              <CardTitle>Where's Waldo</CardTitle>
              <CardDescription>The classic character finder game</CardDescription>
            </CardHeader>
            <CardContent>
              SomeImage
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default Home;