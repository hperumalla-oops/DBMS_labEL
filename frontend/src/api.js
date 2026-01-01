import axios from 'axios';

const API = axios.create({
    // This must match the port in your one.py (usually 8000)
    baseURL: 'http://localhost:8000', 
});

export default API;