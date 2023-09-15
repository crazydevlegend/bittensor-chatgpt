import { useAuth0 } from '@auth0/auth0-react';

export function useAPIFetch() {
  const { getAccessTokenSilently } = useAuth0();

  async function customFetch(url: string, options: RequestInit = {}) {
    const token = await getAccessTokenSilently();

    const fetchOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    return fetch(
      process.env.NEXT_PUBLIC_VALIDATOR_ENDPOINT_BASE_URL + url,
      fetchOptions,
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.json());
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  }

  return customFetch;
}
