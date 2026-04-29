import HomeClient from "@/components/HomeClient";
import HomeShell from "@/components/HomeShell";

export default function Home() {
  return (
    <HomeClient
      leftContent={<HomeShell />}
      footerContent={null}
    />
  );
}
