import "./globals.css";

export const metadata = {
  title: "Selvi Steels",
  description: "Furniture manufacturing order and owner maintenance app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
