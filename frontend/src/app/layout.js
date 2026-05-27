import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Pinspire",
  description: "A Pinterest-inspired image discovery experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
