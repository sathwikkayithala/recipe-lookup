import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ handleLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLoginClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8090/api/auth/login", {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            setErrorMessage("");
            handleLogin();
            navigate("/");
        } catch (err) {
            if (err.response) {
                setErrorMessage("Invalid username or password.");
            } else {
                setErrorMessage("Error logging in. Please try again.");
            }
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleLoginClick} className="mx-auto" style={{ maxWidth: "400px" }}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
        </div>
    );
}

export default Login;
