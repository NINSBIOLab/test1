"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from 'js-cookie';
// const jwt = require('jsonwebtoken');

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter()

    // Function to handle form submission
    const handleLogin = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password.")
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                setError(null);
                const name = userData.username
                const role = userData.role

                // set cookies and expiration
                let currentDate = new Date();
                let expirationTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours in milliseconds

                Cookies.set('name', name, { path: '', expires: expirationTime });
                Cookies.set('role', role, { path: '', expires: expirationTime });

                router.push("/");
            } else {
                const errorMessage = await response.json();
                setError(errorMessage.message);
            }
        } catch (error) {
            console.log(error);
            setError('Error during login:', error);
        }
    };

    return (
        <div className='max-w-[450px] mx-auto bg-slate-700 px-6 py-8 rounded mt-4 shadow'>
            <form onSubmit={handleLogin}>
                <h2 className='text-center text-xl'>Welcome !</h2>
                <p className='text-center'>Please log in :</p>
                <br />

                <div className='pb-2'>
                    <label>Username</label>
                    <input
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full rounded p-2 text-black' type="text" placeholder="User Name" />
                </div>

                <div className='pb-2'>
                    <label>Password</label>
                    <input
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full rounded p-2 text-black' type="password" placeholder="Password" />
                </div>
                <div className='pb-2 min-h-[30px]' >
                    <p className="text-red-400">{error && error}</p>
                </div>
                <input className='bg-green-500 w-full p-2 rounded' type="submit" value="Log In" />
            </form>
        </div>
    );
};

export default Login;