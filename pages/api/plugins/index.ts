import { NextApiRequest, NextApiResponse } from 'next';

import googleSearch from './google-search';
import weather from './open-weather';
import news from './world-news';
import chatpdf from './chatpdf';

export const plugins = [weather, news, googleSearch, chatpdf];

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.json(
    plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      description: plugin.description,
      parameters: plugin.parameters,
    })),
  );
};
