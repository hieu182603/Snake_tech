'use client';

import React from 'react';
import AuthPage from '../login/page';

// Wrapper component for register page
const RegisterPage: React.FC = () => {
  return <AuthPage initialSignUp={true} />;
};

export default RegisterPage;
