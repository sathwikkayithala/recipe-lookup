import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8090/api/auth/register", {
                username,
                password,
            });

            setMessage(response.data);
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setErrorMessage("");
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data);
            } else {
                setErrorMessage("Error registering. Please try again.");
            }
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Register</h2>
            {message && <p className="text-success text-center">{message}</p>}
            <form onSubmit={handleRegister} className="mx-auto" style={{ maxWidth: "400px" }}>
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
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
        </div>
    );
}

export default Register;
