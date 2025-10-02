import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');

    const {register, isLoading, error} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return;
        }

        if (!formData.email.includes('@')) {
            setLocalError('Please enter a valid email address');
            return;
        }

        try {
            await register({
                email: formData.email,
                password: formData.password
            });

            navigate('/confirm-code', {
                state: {
                    email: formData.email,
                    flow: 'email-verification'
                }
            });
        } catch (error) {
            setLocalError(error.message);
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Sign up for your JustNotes account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {displayError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{displayError}</AlertDescription>
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
                                />
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;