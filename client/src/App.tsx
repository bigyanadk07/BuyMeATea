import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Home from './pages/home/home-page';
import Support from './pages/support/support-page';
import Startyour from './pages/startyour/startyour-page';
import About from './pages/about/about-page';
import Footer from './ui/Footer';
import FAQ from './pages/faq/faq-page';
import Resources from './pages/resources/resources-page';
import Creators from './components/common/all-creators'

// Authentication Section
import Signin from './components/auth/signin-page';
import Signup from './components/auth/signup-page';
import PasswordReset from './components/auth/forgot-password'

// Dashboard Section
import Dashboard from './dashboard/dashboard';


// Creator section
import CreatorPage from "./creatorpublicview/creatorPage"

// Type for auth state
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
}

// Protected route component that redirects to signin if not authenticated
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  // Get auth state from localStorage or context in a real app
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // In a real app, this would check for a valid token
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setAuth({
        isAuthenticated: !!token,
        loading: false,
      });
    };

    checkAuth();
  }, []);

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return element;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSigninRoute = location.pathname.startsWith('/signin');
  const isSignupRoute = location.pathname.startsWith('/signup');
  const isForgotPasswordRoute = location.pathname.startsWith('/forgot-password');

  const hideNavbar = isSigninRoute || isSignupRoute || isDashboardRoute || isForgotPasswordRoute;
  const hideFooter = isDashboardRoute || isSignupRoute || isSigninRoute || isForgotPasswordRoute;

  return (
    <div className="">
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<PasswordReset />} />

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/startyour" element={<Startyour />} />
          <Route path="/support" element={<Support />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/creators" element={<Creators />} />
        <Route path="/creator/:username" element={<CreatorPage />} />
          
          {/* Protected routes - using the /* wildcard to catch all dashboard subroutes */}
          <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;