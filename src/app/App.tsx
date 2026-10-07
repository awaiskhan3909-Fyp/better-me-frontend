import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import Favicon from './components/Favicon';

function App() {
  return (
    <>
      <Favicon />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
