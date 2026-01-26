
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductProvider } from './context/ProductContext';

// Lazy load pages for performance optimization
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const CategoryPage = React.lazy(() => import('./pages/Category').then(module => ({ default: module.CategoryPage })));
const BlogPage = React.lazy(() => import('./pages/Blog').then(module => ({ default: module.BlogPage })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="loader"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ProductProvider>
      <HashRouter>
        <Suspense fallback={<Layout><PageLoader /></Layout>}>
          <Routes>
            {/* Public Routes (Shared Layout) */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/deals" element={<Navigate to="/category/deals" replace />} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ProductProvider>
  );
};

export default App;
