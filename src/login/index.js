import React, { useState } from "react";
import config from '../config';
import * as Realm from "realm-web";
import { useNavigate } from "react-router-dom";

const app = new Realm.App({ id: `${config.API}` });

function App() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formData;
        try {
            const credentials = Realm.Credentials.emailPassword(email, password);
            await app.logIn(credentials);
            console.log("Đăng nhập thành công");
            navigate("/AppDEMO");
            window.location.reload();
        } catch (error) {
            console.log(error.error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="fw-bold mb-4 text-uppercase text-center">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default App;
