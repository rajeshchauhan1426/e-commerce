import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/Navbar/navbar";
import Modal from "./components/Modals/Modal";
import RegisterModal from "./components/Modals/RegisterModal";
import ToasterProvider from "./Providers/ToastProvider";
import LoginModal from "./components/Modals/LoginModel";
import getCurrentUser from "./actions/getCurrentUser";
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from "./Providers/modal-provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "e-commerce",
  description: "Product selling website",
};

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito", // Add variable for the Nunito font
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.className} antialiased`} 
      >
        
        <ToasterProvider/>
        <LoginModal/>
       <RegisterModal/>
        <Navbar currentUser={currentUser}/>
        <ModalProvider/>
       
        {children}
      </body>
    </html>
  );
}
