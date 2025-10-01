// pages/ConfirmCode.jsx
import React, {useState, useRef, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';
import {authService} from '../services/authService';

const ConfirmCode = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    const {verifyEmail, resendVerification} = useAuthStore();

    const {email, flow} = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }

            if (index === 5 && value) {
                const fullCode = newCode.join('');
                if (fullCode.length === 6) {
                    handleVerifyCode(fullCode);
                }
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newCode = pasteData.split('').concat(Array(6 - pasteData.length).fill(''));
            setCode(newCode);
            const fullCode = newCode.join('');
            if (fullCode.length === 6) {
                handleVerifyCode(fullCode);
            } else {
                inputRefs.current[Math.min(pasteData.length, 5)].focus();
            }
        }
    };

    const handleVerifyCode = async (verificationCode) => {
        if (verificationCode.length !== 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (flow === 'password-reset') {
                // For password reset, directly navigate to reset page
                // The reset endpoint will validate the code when the user submits the new password
                navigate('/reset-password', {
                    state: {
                        code: verificationCode,
                        email,
                    }
                });
            } else {
                // For email verification flow
                await verifyEmail(verificationCode);
                navigate('/notes');
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Invalid or expired verification code');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        await handleVerifyCode(verificationCode);
    };

    const handleResendCode = async () => {
        setResending(true);
        setError('');

        try {
            if (flow === 'password-reset') {
                await authService.forgotPassword(email);
            } else {
                await resendVerification(email);
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {flow === 'password-reset' ? 'Reset Password' : 'Verify Your Email'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            We sent a 6-digit code to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-center space-x-2">
                                {code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-semibold"
                                        disabled={isLoading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the code?{' '}
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={handleResendCode}
                                        disabled={resending}
                                        className="p-0 h-auto font-medium"
                                    >
                                        {resending ? 'Resending...' : 'Resend Code'}
                                    </Button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ConfirmCode;