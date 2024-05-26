import { FetchProps } from "@/types";


const fetchAPI = async <T>({url, options}: FetchProps) => {
  try {
    const response = await fetch(url, options);
    if (response.status >= 400) {
      throw new Error("server error");
    }
    const result: T = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    if (error instanceof Error) console.log("Fetching data error: ", error);
    else throw Error("Unknown error while fetching data.");
  }
};

export default fetchAPI;