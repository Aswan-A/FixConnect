// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";

export function meta() {
  return [{ title: "FixConnect" }];
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Outlet /> {/* This is where your routes render */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
