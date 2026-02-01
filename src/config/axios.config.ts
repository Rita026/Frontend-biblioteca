import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, no hace nada
  (error) => {
    // Si el servidor responde con un código 500
    if (error.response && error.response.status === 500) {
      console.error("Error 500 detectado, redirigiendo...");
      window.location.href = '/500'; // Redirige a la página automáticamente
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


