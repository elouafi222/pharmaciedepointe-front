import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EnAttente from "./pages/EnAttente";
import Historique from "./pages/Historique";
import Rapports from "./pages/Rapports";
import Collaborateurs from "./pages/Collaborateurs";
import Messages from "./pages/Messages";
import Today from "./pages/Today";
import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound";
import Termine from "./pages/Termine";
import Warning from "./pages/Warning";
import CyclesEnRetard from "./pages/CyclesEnRetard";
const App = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Toaster containerStyle={{ zIndex: 99999 }} />
      <Routes>
        <Route path="/"element={ !user ? <Login /> : <Navigate to="/ordonnances" />}  />
        <Route path="/ordonnances" element={user ? <Home /> : <Login />} />
        <Route path="ordonnances">
          <Route path="message" element={user ? <Messages /> : <Login />} />
          <Route path="enretard" element={user ? <EnAttente /> : <Login />} />
          <Route path="cyclesEnRetard" element={user ? <CyclesEnRetard /> : <Login />} />
          <Route path="termine" element={user ? <Termine /> : <Login />} />
          <Route path="dujour" element={user ? <Today /> : <Login />} />
          <Route
            path="historique"
            element={user ? <Historique /> : <Login />}
          />
          <Route path="rapports" element={user ? <Rapports /> : <Login />} />
          <Route
            path="collaborateurs"
            element={
              user && user.role === "admin" ? <Collaborateurs /> : <Login />
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
