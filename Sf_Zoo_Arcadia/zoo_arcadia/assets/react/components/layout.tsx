import React, { ReactNode } from "react";
import Header from './header';
import Footer from './footer';
import {useScrollToTop} from './useScrolToTop';


interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  useScrollToTop();
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};


