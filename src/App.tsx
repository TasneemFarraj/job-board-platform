import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { MobileTabBar } from "./components/layout/MobileTabBar";
import { BrowseJobs } from "./pages/BrowseJobs";
import { SavedJobs } from "./pages/SavedJobs";
import { MyApplications } from "./pages/MyApplications";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16 dark:bg-dark-bg sm:pb-0">
        <Navbar />
        <Routes>
          <Route path="/" element={<BrowseJobs />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/applications" element={<MyApplications />} />
        </Routes>
        <MobileTabBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
