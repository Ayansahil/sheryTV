import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from "./components/Topbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ContinueRow from "./components/ContinueRow.jsx";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import SidebarLogo from "./components/Sidebar/SidebarLogo.jsx";
import SidebarMenu from "./components/Sidebar/SidebarMenu.jsx";
import SidebarFooter from "./components/Sidebar/SidebarFooter.jsx";
import MobileSidebar from "./components/MobileSidebar.jsx";
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
import Genres from './pages/Genres';
import Collections from './pages/Collections';
import Downloads from './pages/Downloads';

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

const MainLayout = () => (
  <div className="flex min-h-screen bg-[#1A1625]">
    {/* Desktop/Tablet Sidebar */}
    <Sidebar>
      <SidebarLogo />
      <SidebarMenu />
      <SidebarFooter />
    </Sidebar>

    {/* Mobile Sidebar (Overlay) */}
    <MobileSidebar />

    {/* Main Content */}
    <main className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route element={<MainLayout />}>
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
          <Route path="/continue-watching" element={<ContinueWatchingPage />} />
          <Route path="/recently-added" element={<RecentlyAddedPage />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/view-all/:category" element={<ViewAll />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:id" element={<PersonDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/downloads" element={<Downloads />} />
        </Route>

        {/* Routes without main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default App;
