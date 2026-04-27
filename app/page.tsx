import HomeClient from "@/components/HomeClient";
import CityFooter from "@/components/CityFooter";
import HomeShell from "@/components/HomeShell";

export default function Home() {
  return (
    <HomeClient
      leftContent={<HomeShell />}
      footerContent={<CityFooter />}
    />
  );
}
