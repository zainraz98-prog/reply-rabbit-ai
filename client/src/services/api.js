import axios from 'axios';

// Replace the xxxx with your actual Railway link
const api = axios.create({
  baseURL: 'https://server-production-xxxx.up.railway.app',
});

export default api;