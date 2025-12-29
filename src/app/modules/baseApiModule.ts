import ky from '@toss/ky';

const DEFAULT_OPTIONS = {
  retry: {
    limit: 3,
  },
};

export const baseApiModule = async ({
  url,
  method = 'GET',
  options = DEFAULT_OPTIONS,
}: {
  url: string;
  method?: string;
  options?: ky.Options;
}) => {
  return await ky(url, {
    ...options,
    method,
  }).json();
};
