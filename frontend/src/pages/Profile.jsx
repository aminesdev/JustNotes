import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useAuthStore} from '../stores/authStore';

const Profile = () => {
    const {user, logout} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">User data not available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Your personal account details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Email
                            </label>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Role
                            </label>
                            <p className="text-sm capitalize">{user.role?.toLowerCase() || 'user'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Email Verified
                            </label>
                            <p className="text-sm">
                                {user.isVerified ? (
                                    <span className="text-green-600">Verified</span>
                                ) : (
                                    <span className="text-yellow-600">Pending Verification</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Member Since
                            </label>
                            <p className="text-sm">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>
                        Account management actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;