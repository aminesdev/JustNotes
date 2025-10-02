import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';

const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [localErrors, setLocalErrors] = useState({});

    const {login, isLoading, error, accessToken, user} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && user) {
            navigate('/notes', {replace: true});
        }
    }, [accessToken, user, navigate]);

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalErrors({});

        if (!validateForm()) return;

        try {
            await login(formData);
        } catch (error) {
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (localErrors[e.target.name]) {
            setLocalErrors(prev => ({...prev, [e.target.name]: ''}));
        }
    };

    if (accessToken && user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your notes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={localErrors.email ? 'border-red-500' : ''}
                                />
                                {localErrors.email && (
                                    <p className="text-sm text-red-600">{localErrors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={localErrors.password ? 'border-red-500' : ''}
                                />
                                {localErrors.password && (
                                    <p className="text-sm text-red-600">{localErrors.password}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm space-y-2">
                                <div>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary hover:underline font-medium">
                                        Sign up
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;