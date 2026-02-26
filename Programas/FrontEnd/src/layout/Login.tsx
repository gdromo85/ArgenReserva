import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getApiUrl } from "../utils/api";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/colors.css";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    general: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  
  // Validación de email
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "El usuario es requerido";
    }
    /* const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor ingrese un email válido";
    } */
    return "";
  };

  // Validación de contraseña
  const validatePassword = (password: string): string => {
    if (!password) {
      return "La contraseña es requerida";
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  // Validar todo el formulario
  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
      general: ""
    });

    return !emailError && !passwordError;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const fieldError = name === 'email' 
        ? validateEmail(value) 
        : validatePassword(value);
      
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
        general: "" // Limpiar error general al modificar campos
      }));
    }
  };

  // Manejar cuando el campo pierde el foco
  const handleBlur = (fieldName: keyof typeof touched) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Validar el campo específico
    const fieldError = fieldName === 'email' 
      ? validateEmail(formData[fieldName]) 
      : validatePassword(formData[fieldName]);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true
    });

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

    try {
      const respuesta = await axios.post(`${getApiUrl()}api/Usuario/validarUsuario`, {
          nombre: formData.email,
          passwordHash: formData.password
        })

      //console.log("🚀 ~ handleSubmit ~ respuesta.status:", respuesta.status)
      //console.log("🚀 ~ handleSubmit ~ respuesta:", respuesta)

      
      // Aquí iría la lógica real de autenticación
      // Por ahora simularemos un error de credenciales inválidas
      
      let isValidCredentials = false;
      if (respuesta.status === 200) isValidCredentials = true
      
      if (!isValidCredentials) {
        setErrors(prev => ({
          ...prev,
          general: "Credenciales inválidas. Verifique su usuario y contraseña."
        }));
      } else {
        login(respuesta.data);
        navigate("/panel");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      setErrors(prev => ({
        ...prev,
        general: "Credenciales inválidas. Verifique su usuario y contraseña."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Error general */}
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Usuario
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 border-2 focus:outline-none sm:text-sm/6 ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:border-indigo-600 focus:ring-indigo-600'
                }`}
                placeholder="Ingrese su email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Contraseña
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 border-2 focus:outline-none sm:text-sm/6 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:border-indigo-600 focus:ring-indigo-600'
                }`}
                placeholder="Ingrese su contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Aceptar'
              )}
            </button>
          </div>
        </form>

        {/* Información de prueba */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciales de prueba:</h3>
          <p className="text-xs text-blue-700">Usuario: usuarioprueba</p>
          <p className="text-xs text-blue-700">Contraseña: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;