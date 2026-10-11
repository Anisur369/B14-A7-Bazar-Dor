import AllProducts from "@/components/AllProducts";
import HeroSection from "@/components/HeroSection";
import PriceTicker from "@/components/PriceTicker";
import TodayDownPrice from "@/components/TodayDownPrice";
import TodayUpPrice from "@/components/TodayUpPrice";

export default function Home() {
  return (
    <>
      <PriceTicker />
      <HeroSection />
      <TodayUpPrice />
      <div  id="সব-পণ্য">
      <TodayDownPrice />
      <AllProducts />
      </div>
    </>
  );
}
