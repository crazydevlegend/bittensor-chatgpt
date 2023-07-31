import { useEffect, useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { BlockingData } from 'swr/_internal';
import { Config } from 'tailwindcss';

interface UseApiResponseType {
  loading: boolean,
  data: any;
  error: Error | undefined;
  mutate: Function;
}


/**
 * Re-usable SWR api implementation.
 *
 * @param {string} url
 * @param {object} params
 * @returns object
 */
function useApi(url:string | null, params = {}): UseApiResponseType {
  const usp = new URLSearchParams(params);
  const [cacheData, setCacheData] = useState<[] | Object>();

  // Create a stable key for SWR
  usp.sort();
  const qs = usp.toString();

  const { data, error, mutate } = useSWR(url && `${url}${qs?'?'+qs:''}`, fetcher);

  const isLoading = !error && !data;

  useEffect(() => {
    if(isLoading) return;
    setCacheData(data);
  }, [data]);

  return {
    loading: !error && !data,
    data: cacheData,
    error,
    mutate
  };
}


const fetcher = async (url: string) => {
  const res = await fetch(url, {method: 'GET'})

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }

  return res.json()
}


export default useApi;