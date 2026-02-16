import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'admin' && password === 'admin') {
            // Navigate to home page on successful login
            history.push('/home');
        } else {
            // Handle error
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <h2>Login Page</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
