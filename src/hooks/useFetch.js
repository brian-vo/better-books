import { useState, useEffect } from "react";

// Hook for getting data from a URL and returning it as a JSON obj
const useFetch = (url, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook runs code every time something on the page is rendered / re-rendered
  useEffect(() => {
    // Async call, GET request to fetch json data
    fetch(url, {
      method,
      body,
    })
      .then((response) => {
        // Server gave a faulty response, eg. if the requested resource does not exist
        if (!response.ok) {
          throw Error("Problem fetching requested resource");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
        setIsLoading(false);
      })
      // Catch network errors, eg. problem connecting to server
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
    // Run useEffect whenever a new url is given
  }, [url, method, body]);

  return { data, isLoading, error };
};

export default useFetch;
