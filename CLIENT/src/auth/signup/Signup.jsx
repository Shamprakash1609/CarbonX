import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Signup.css';

const Signup = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        jobRole: "",
        mineName: "",
        state: "",
        city: "",
        Ownership: "",
        Type: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const jobRoles = [
        "Mine Manager",
        "Mining Engineer",
        "Geologist",
        "Surveyor",
        "Blasting Engineer",
        "Ventilation Engineer",
        "Safety Officer",
        "Environmental Officer",
        "Compliance Officer",
        "Mine Operator",
        "Shift In-charge",
        "Maintenance Engineer",
        "Driller",
        "Explosives Handler",
        "Mining Technician",
        "Warehouse Supervisor",
        "Administrative Assistant",
        "Human Resources Officer",
        "Mineral Processing Engineer",
        "Hydrologist",
        "Coal Quality Analyst",
        "Heavy Equipment Trainer",
        "Electrician",
        "Welder",
        "Mechanic",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const registerUrl = "http://localhost:5002/carbonx/v1/register";
            await axios.post(registerUrl, data, {
                headers: { "Content-Type": "application/json" },
            });

            const loginUrl = "http://localhost:5002/carbonx/v1/login";
            const loginData = { email: data.email, password: data.password };
            const { data: loginResponse } = await axios.post(loginUrl, loginData);

            localStorage.setItem("token", loginResponse.accessToken);
            const redirectPath = localStorage.getItem("redirectPath") || "/";
            localStorage.removeItem("redirectPath");
            navigate(redirectPath);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again later.");
            }
            setSuccess("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <form className="form-container" onSubmit={handleSubmit}>
                    <h1>Create Account</h1>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                        value={data.name}
                        required
                        className="input-field"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                        className="input-field"
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        name="phone"
                        onChange={handleChange}
                        value={data.phone}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Mine Name"
                        name="mineName"
                        onChange={handleChange}
                        value={data.mineName}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={handleChange}
                        value={data.state}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={handleChange}
                        value={data.city}
                        required
                        className="input-field"
                    />
                    <select
                        name="jobRole"
                        onChange={handleChange}
                        value={data.jobRole}
                        required
                        className="input-field"
                    >
                        <option value="" disabled>
                            Select Job Role
                        </option>
                        {jobRoles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    <select
                        name="Ownership"
                        onChange={handleChange}
                        value={data.Ownership}
                        required
                        className="input-field"
                    >
                        <option value="" disabled>
                            Select Ownership
                        </option>
                        {[
                            'ECL', 'BCCL', 'CESC', 'SAIL', 'OCL Iron Steel Limited', 
                            'WBPDCL', 'IISCO', 'TSL', 'CCL', 'NTPC', 'HIL', 'DVC', 
                            'JSMDCL', 'NCL', 'WCL', 'TUML', 'SISCL', 'JPVL', 
                            'Sasan Power (Reliance Power Limited)', 
                            'RCCPL Ltd, a subsidiary of Birla Corp', 'SECL', 'RRVUNL',
                            'BALCO (Vedanta Group)', 'AMBUJA', 'NTPC', 'MCL', 'NLC Ltd',
                            'GMR Group', 'NEC', 'GMDCL', 'GIPCL', 'GHCL Limited', 
                            'BLMCL', 'RSMML', 'VS Lignite Power Private Limited', 
                            'TSPGCL', 'SCCL',
                        ].map((owner) => (
                            <option key={owner} value={owner}>
                                {owner}
                            </option>
                        ))}
                    </select>
                    <select
                        name="Type"
                        onChange={handleChange}
                        value={data.Type}
                        required
                        className="input-field"
                    >
                        <option value="" disabled>
                            Select Mine Type
                        </option>
                        <option value="Under ground">Under ground</option>
                        <option value="Open Cast">Open Cast</option>
                        <option value="Mixed">Mixed</option>
                    </select>
                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">{success}</div>}
                    <button type="submit" className="btn-green" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
    
};

export default Signup;
