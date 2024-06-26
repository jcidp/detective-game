import { FetchProps } from "@/types";
import { useEffect, useState } from "react"

const useFetchData = <DataType>({url, options = undefined}: FetchProps): [DataType | undefined, Error | null, boolean] => {
  const [data, setData] = useState<DataType | undefined>();
  const [error, setError] = useState<Error|null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(url, options);
        if (response.status >= 400) {
          throw new Error("server error");
        }
        const result: DataType = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof Error) setError(error);
        else throw Error("Unknown error while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url, options]);

  return [data, error, loading];
};

export default useFetchData;