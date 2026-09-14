import Navbar from "../../../components/navbar/navbar";
import Banner from "../../../components/banner/banner";
import QuickActions from "../../../components/quick-actions/quickActions";
import ExploreRooms from "../../../components/explore-rooms/exploreRooms";
import ExploreLocation from "../../../components/explore-location/exploreLocation";
import TrustSection from "../../../components/trust/trustSection";
import Footer from "../../../components/footer/footer";


export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#F7F5F0] text-slate-800">

        {/* Ambiente visual */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute right-[-10rem] top-[35rem] h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative">
          <Banner />

          <QuickActions />
          <TrustSection />

          <ExploreRooms />
          <ExploreLocation />
        </div>

        <Footer />
      </main>
    </>
  );
}