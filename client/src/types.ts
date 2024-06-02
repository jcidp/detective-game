interface FetchProps {
  url: string;
  options?: {
    method: string;
    headers: {[header: string]: string};
    body: string;
  }
}

export type {FetchProps}