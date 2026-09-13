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