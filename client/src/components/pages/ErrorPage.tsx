import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom"

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage: string;
  let errorCode = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
    errorCode = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorCode = error.name;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <div className="text-center mt-12">
      <h1 className="text-2xl font-semibold">Oh no, an error has occurred!</h1>
      <p className="text-lg my-4">{errorCode} {errorMessage}</p>
      <Link to="/" className="text-blue-600 mt-4">
        Return Home
      </Link>
    </div>
  );
}

export default ErrorPage;