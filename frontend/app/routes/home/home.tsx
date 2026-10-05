import Navbar from "../../../src/components/navbar/navbar";
import Banner from "../../../src/components/banner/banner";
import QuickActions from "../../../src/components/quick-actions/quickActions";
import ExploreRooms from "../../../src/components/explore-rooms/exploreRooms";
import ExploreLocation from "../../../src/components/explore-location/exploreLocation";
import TrustSection from "../../../src/components/trust/trustSection";
import Footer from "../../../src/components/footer/footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <Banner />

        <QuickActions />
        <TrustSection />

        <ExploreRooms />
        <ExploreLocation />
        <Footer />
      </main>
    </>
  );
}