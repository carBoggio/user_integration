import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
// import AllRafflesPage from "@/pages/AllRafflesPage";
// import RaffleDetailPage from "@/pages/RaffleDetailPage";
import UserProfilePage from "@/pages/UserProfilePage";
import LotteryPage from "@/pages/LotteryPage";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      {/* <Route element={<AllRafflesPage />} path="/raffles" />
      <Route element={<RaffleDetailPage />} path="/raffle/:id" /> */}
      <Route element={<UserProfilePage />} path="/profile" />
      <Route element={<LotteryPage />} path="/lottery" />
    </Routes>
  );
}

export default App;
