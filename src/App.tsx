import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './stores/themeStore';
import clsx from 'clsx';
import Navbar from './components/Navbar';
import Player from './components/Player';
import Home from './pages/Home';
import Library from './pages/Library';
import Auth from './pages/Auth';
import { useAuthStore } from './stores/authStore';

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useThemeStore((state) => state.theme);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={clsx(
          'min-h-screen transition-colors duration-200',
          theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
        )}>
          <Navbar />
          <main className="container mx-auto px-4 pb-24 pt-20 lg:ml-64 lg:pl-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/library" 
                element={isAuthenticated ? <Library /> : <Auth />} 
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Player />
          <Toaster 
            position="bottom-center"
            toastOptions={{
              className: theme === 'dark' ? '!bg-gray-800 !text-white' : '',
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;