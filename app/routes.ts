import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),               // /
  route('create-issue', 'routes/createissue.tsx'),  // /signup
    route('profile', 'routes/profile.tsx'),  // /signup

  route('pro-register', 'routes/getpro.tsx'), // /pro-register
  route('login', 'routes/login.tsx'),    // /login
  route('signup', 'routes/signup.tsx'),  // /signup
] satisfies RouteConfig;
