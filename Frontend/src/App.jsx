import Sidebar from "./components/Sidebar/Sidebar.jsx";
import SidebarLogo from "./components/Sidebar/SidebarLogo.jsx";
import SidebarMenu from "./components/Sidebar/SidebarMenu.jsx";
import SidebarFooter from "./components/Sidebar/SidebarFooter.jsx";
import Topbar from "./components/Topbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ContinueRow from "./components/ContinueRow.jsx";
import { Routes, Route } from "react-router-dom";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import RecentlyAdded from "./components/RecentlyAdded";
import ContinueWatching from "./components/ContinueWatching";
import Favourites from "./pages/Favourites";
import Explore from "./pages/Explore";
import ViewAll from "./pages/ViewAll";
import Admin from "./pages/Admin";
import People from "./pages/People";
import PersonDetail from "./pages/PersonDetail";
import Settings from "./pages/Settings";


// Page components - inline banate hain abhi
const FavouritesPage = () => {
  const { items } = window.__store?.getState()?.favorites || { items: [] };
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Favourites</h1>
      <p className="text-gray-400">Login karke movies favorite karo!</p>
    </div>
  );
};

const ContinueWatchingPage = () => (
  <div className="min-h-screen bg-[#1A1625]">
    <Topbar />
    <ContinueWatching />
  </div>
);

const RecentlyAddedPage = () => (
  <div className="min-h-screen bg-[#1A1625]">
    <Topbar />
    <RecentlyAdded />
  </div>
);

const App = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1625]">
      <Sidebar>
        <SidebarLogo />
        <SidebarMenu />
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Topbar />
                <HeroSection />
                <ContinueWatching />
                <ContinueRow />
                <RecentlyAdded />
              </>
            }
          />
          <Route path="/movie/:type/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/continue-watching" element={<ContinueWatchingPage />} />
          <Route path="/recently-added" element={<RecentlyAddedPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/view-all/:category" element={<ViewAll />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:id" element={<PersonDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
