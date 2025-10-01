import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {EncryptionService} from '../../utils/encryption';
import {authService} from '../../services/authService';
import {useAuthStore} from '../../stores/authStore';

const EncryptionSetup = () => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hasEncryption, setHasEncryption] = useState(false);

    const {user, setUser} = useAuthStore();

    // Check if encryption is already setup
    useEffect(() => {
        if (user?.publicKey && user?.encryptedPrivateKey) {
            setHasEncryption(true);
        } else {
            setHasEncryption(false);
        }
    }, [user]);

    const handleSetupEncryption = async () => {
        // Clear previous errors
        setError('');

        // Validate passwords
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Starting encryption setup...');

            // Generate key pair
            const keyPair = EncryptionService.generateKeyPair();
            console.log('Key pair generated:', {
                publicKey: keyPair.publicKey,
                hasPrivateKey: !!keyPair.privateKey
            });

            // Encrypt private key
            const encryptedPrivateKey = EncryptionService.encryptPrivateKey(
                keyPair.privateKey,
                password
            );
            console.log('Private key encrypted, length:', encryptedPrivateKey.length);

            const payload = {
                publicKey: keyPair.publicKey,
                encryptedPrivateKey: encryptedPrivateKey
            };
            console.log('Sending payload to API:', payload);

            // Call API
            const response = await authService.setupEncryption(payload);
            console.log('API response:', response);

            // Update user in store and localStorage
            const updatedUser = {
                ...user,
                publicKey: keyPair.publicKey,
                encryptedPrivateKey: encryptedPrivateKey
            };

            setUser(updatedUser);

            // Also update localStorage directly to ensure persistence
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                const updatedUserData = {
                    ...parsedUser,
                    publicKey: keyPair.publicKey,
                    encryptedPrivateKey: encryptedPrivateKey
                };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
            }

            setSuccess('Encryption setup completed successfully');
            setHasEncryption(true);
            setPassword('');
            setConfirmPassword('');
            setStep(3);
        } catch (error) {
            console.error('Encryption setup error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // More detailed error messages
            let errorMessage = 'Failed to setup encryption';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Check for specific error types
            if (error.response?.status === 401) {
                errorMessage = 'Authentication required. Please login again.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Encryption endpoint not found. Please contact support.';
            } else if (error.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear error when user starts typing
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (error) setError('');
    };

    // If encryption is already setup, show status
    if (hasEncryption) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Encryption Status</CardTitle>
                    <CardDescription>
                        Your encryption is properly configured and securing your data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Encryption is enabled and protecting your data
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Setup Encryption</CardTitle>
                <CardDescription>
                    End-to-end encryption is required to protect your notes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                <strong>Important:</strong> Your notes are encrypted on your device before being sent to the server.
                                You must remember your password to decrypt your data. We cannot recover your data if you forget your password.
                                <br /><br />
                                <strong>This is a one-time setup.</strong>
                            </AlertDescription>
                        </Alert>
                        <Button onClick={() => setStep(2)} className="w-full">
                            Start Setup
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Encryption Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter a strong password (minimum 8 characters)"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                This password will be used to encrypt/decrypt your notes locally.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSetupEncryption}
                                disabled={isLoading || !password || !confirmPassword}
                                className="flex-1"
                            >
                                {isLoading ? 'Setting up...' : 'Complete Setup'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStep(1);
                                    setPassword('');
                                    setConfirmPassword('');
                                    setError('');
                                }}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                            <AlertDescription className="text-green-800">
                                Encryption setup completed successfully! You can now create encrypted notes.
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => setHasEncryption(true)}
                            variant="outline"
                            className="w-full"
                        >
                            Continue
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EncryptionSetup;