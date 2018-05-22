import cookies from 'browser-cookies';

export const _csrf = typeof window !== 'undefined' && cookies.get('_csrf');
export const accessToken =
  typeof window !== 'undefined' && cookies.get('access_token');
