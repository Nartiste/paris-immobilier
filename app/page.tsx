import HomeClient from "@/components/HomeClient";
import CityFooter from "@/components/CityFooter";
import HomeShell from "@/components/HomeShell";
import TopNav from "@/components/TopNav";

export default function Home() {
  return (
    <>
      <TopNav />
      <HomeClient
        leftContent={<HomeShell />}
        footerContent={<CityFooter />}
      />
    </>
  );
}
