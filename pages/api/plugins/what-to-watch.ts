export const runPlugin = async ({
    show_name,
  }: {
    show_name: string;
  }): Promise<string> => {
    try {
      const response_data: any = await fetch(
        `https://whattowatch.dev/shows/details/${encodeURIComponent(show_name)}`,
      ).then((res) => res.json());
   
      if (response_data?.result) {
        const {
          name,
          genres,
          overview,
          first_air_date,
          last_air_date,
          number_of_seasons,
          number_of_episodes,
          vote_average,
          production_companies,
          production_countries,
          languages,
          homepage,
        } = response_data.result;
  
        const data = `
          Name: ${name}
          Genres: ${genres
            .map((genre: { name: string }) => genre.name)
            .join(', ')}
          Overview: ${overview}
          First Air Date: ${first_air_date}
          Last Air Date: ${last_air_date}
          Number of Seasons: ${number_of_seasons}
          Number of Episodes: ${number_of_episodes}
          Average Vote: ${vote_average}
          Production Companies: ${production_companies
            .map((company: { name: string }) => company.name)
            .join(', ')}
          Production Countries: ${production_countries
            .map((country: { name: string }) => country.name)
            .join(', ')}
          Languages: ${languages.join(', ')}
          Homepage: ${homepage}
        `;
        return data;
      } else {
        return 'TV show details not found.';
      }
    } catch (err) {
      console.error(err);
      return 'An error occurred while fetching TV show details.';
    }
  };
  
  export default {
    id: 'what-to-watch',
    name: 'What To Watch',
    description: 'Get details of a TV show by name.',
    parameters: {
      show_name: {
        type: 'string',
        description: 'show_name',
      },
    },
    run: runPlugin,
  };