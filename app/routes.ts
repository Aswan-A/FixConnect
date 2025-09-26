import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),               // /
  route('pro-register', 'routes/getpro.tsx'), // /pro-register
  route('login', 'routes/login.tsx'),    // /login
  route('signup', 'routes/signup.tsx'),  // /signup
] satisfies RouteConfig;
