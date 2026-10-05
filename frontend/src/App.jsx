import SavedOutfits from "./pages/SavedOutfits";
import OutfitResult from "./pages/OutfitResult";
import OutfitStylist from "./pages/OutfitStylist";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import StylePreferences from "./pages/StylePreferences";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import OutfitGenerator from "./pages/OutfitGenerator";
import Avatar from "./pages/Avatar";

function App() {

  const path = window.location.pathname;

  if (path === "/profile") {
    return <Profile />;
  }

  if (path === "/preferences") {
    return <StylePreferences />;
  }

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/wardrobe") {
    return <Wardrobe />;
  }

  if (path === "/outfit") {
    return <OutfitGenerator />;
  }

  if (path === "/avatar") {
    return <Avatar />;
  }

  if (path === "/outfit-stylist") {
  return <OutfitStylist />;
  }

  if (path === "/outfit-result") {
  return <OutfitResult />;
  }

  if (path === "/saved-outfits") {
  return <SavedOutfits />;
  }

  return <Home />;
}

export default App;