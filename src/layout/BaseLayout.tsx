import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";


type DashboardLayoutProps = {
  children: React.ReactNode,
};

function BaseLayout({ children }: DashboardLayoutProps) {
  return (
    <>
    <div><Header/></div>
    <div><Hero/></div>
     <main>{children}</main> 
      <Footer/>
    </>
  )
}

export default BaseLayout