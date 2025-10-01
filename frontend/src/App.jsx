import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthStore} from './stores/authStore';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ConfirmCode from './pages/ConfirmCode';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const ProtectedRoute = ({children}) => {
    const {accessToken, user, isLoading, isInitialized} = useAuthStore();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    return accessToken && user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({children}) => {
    const {accessToken, user, isLoading, isInitialized} = useAuthStore();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    return !(accessToken && user) ? children : <Navigate to="/notes" replace />;
};

function App() {
    const {initialize, isInitialized} = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <AuthLayout>
                            <Register />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ForgotPassword />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/reset-password" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ResetPassword />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/confirm-code" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ConfirmCode />
                        </AuthLayout>
                    </PublicRoute>
                } />

                <Route path="/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/notes" element={<Notes />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/" element={<Navigate to="/notes" replace />} />
                                <Route path="*" element={<Navigate to="/notes" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;