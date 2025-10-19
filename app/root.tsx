// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";

export function meta() {
  return [{ title: "Reparo" }];
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
