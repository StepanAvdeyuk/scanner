import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom';

import './App.css';
import ScanListPage from './pages/ScanListPage';
import LoginPage from './pages/LoginPage';
import ScanCardDetails from './pages/ScanListPage/components/ScanCardDetails';
import ScopeGropesListPage from './pages/ScopeGropesListPage';
import InventoryPageCard from './pages/ScanListPage/components/InventoryPageCard';
import SettingsPageCard from './pages/ScanListPage/components/SettigsPageCard';
import EventsPageCard from './pages/ScanListPage/components/EventsPageCard';
import ScanAddPage from './pages/ScanAddPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ScanListPage />,
    },
    {
      path: "/details/:name/*",
      element: <ScanCardDetails />,
      children: [
        {
          path: "settings/:reportId",
          element: <SettingsPageCard />
        },
        {
          path: "inventory/:reportId",
          element: <InventoryPageCard />
        },
        {
          path: "events/:reportId",
          element: <EventsPageCard />
        }
      ]
    },
    {
      path: "scans/:name",
      element: <ScanCardDetails />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/scope-groups",
      element: <ScopeGropesListPage />,
    },
    {
      path: "/scan-add",
      element: <ScanAddPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
