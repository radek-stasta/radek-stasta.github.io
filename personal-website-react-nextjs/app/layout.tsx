import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radek Šťasta - Personal Website",
  description: "Personal website of Radek Šťasta",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
