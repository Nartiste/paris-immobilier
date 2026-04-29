import HomeClient from "@/components/HomeClient";
import HomeShell from "@/components/HomeShell";
import CityFooter from "@/components/CityFooter";

export default function Home() {
  return (
    <HomeClient
      leftContent={<HomeShell />}
      footerContent={<CityFooter />}
    />
  );
}
