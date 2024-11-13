import { ReactNode } from "react";
import Header from "./components/layout/Header";
import Navigation from "./Navigation";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
