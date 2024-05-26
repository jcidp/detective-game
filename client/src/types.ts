interface FetchProps {
  url: string;
  options: undefined | {
    method: string;
    headers: {[header: string]: string};
    body: string;
  }
}

export type {FetchProps}