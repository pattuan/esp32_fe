import { useState } from 'react';
import validator from '@rjsf/validator-ajv8';
import config from '../config';
import * as Realm from "realm-web";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

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
            await app.emailPasswordAuth.registerUser({ email, password });
            console.log("Đăng ký thành công");
            navigate("/");  
        } catch (error) {
            console.log(error.error);
        }
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            margin: '0'
        }}>
            <div className="container" style={{
                background: 'white',
                padding: '40px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                textAlign: 'center',
                width: '400px',
                maxWidth: '100%'
            }}>
                <h2 style={{
                    marginBottom: '20px',
                    fontSize: '28px',
                    color: '#333'
                }}>Đăng Ký</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '15px',
                                margin: '10px 0 20px 0',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Mật Khẩu" 
                            value={formData.password} 
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '15px',
                                margin: '10px 0 20px 0',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '15px',
                        background: '#007bff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '18px',
                        color: 'white',
                        cursor: 'pointer'
                    }}>Đăng Ký</button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    Bạn có tài khoản rồi? <Link to="/">Đăng Nhập</Link>
                </p>
            </div>
        </div>
    );
    
}

export default App;
