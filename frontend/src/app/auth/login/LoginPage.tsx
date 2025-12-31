'use client';

import React from 'react';
import AuthView from '../AuthView';

const LoginPage: React.FC = () => {
    return <AuthView initialSignUp={false} />;
};

export default LoginPage;
