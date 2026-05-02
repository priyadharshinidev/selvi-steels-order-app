import "./globals.css";

export const metadata = {
  title: "Steels Order Management App",
  description: "Steel order management and owner maintenance app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
