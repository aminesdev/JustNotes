import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {passwordService} from '../services/passwordService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await passwordService.forgotPassword(email);
            // Redirect to code confirmation page with email as state
            navigate('/confirm-code', {state: {email, flow: 'password-reset'}});
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* App Logo/Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to receive a verification code
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
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                            </Button>

                            <div className="text-center text-sm">
                                Remember your password?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;