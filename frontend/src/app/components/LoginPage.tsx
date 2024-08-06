/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { LoginData, Authenticate } from '@/app/api/auth/Login';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    membername: '',
    memberpass: '',
  });
  useEffect(() => {
    async function AuthenticateUser() {
      try {
        const access_token = localStorage.getItem('access_token');
        if (access_token != null) {
          const response = await Authenticate();
          if (response == true) {
            window.location.href = '/dashboard/visits';
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    AuthenticateUser();
  }, []);

  async function handleLogin() {
    try {
      const response = await LoginData(loginData);
      if (response?.status === 200) {
        if (response?.data.access_token != null) {
          localStorage.setItem('access_token', response.data.access_token);
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleLoginData(event: any) {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  return (
    <Fragment>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-4xl w-full shadow-lg rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative hidden w-1/2 lg:block">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://www.sattva.co.in/wp-content/uploads/2022/12/Untitled-1200-%C3%97-630-px.png"
              alt="Side Banner"
            />
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 bg-white">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <img
                  className="mx-auto h-12 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Sign in to your account
                </h2>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="membername"
                      name="membername"
                      type="text"
                      autoComplete="email"
                      required
                      placeholder="Currently you should enter 'user'"
                      className="block w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 shadow-sm placeholder-gray-400"
                      onChange={(e) => {
                        handleLoginData(e);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="memberpass"
                      name="memberpass"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="currently you should 'pass'"
                      className="block w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 shadow-sm placeholder-gray-400"
                      onChange={(e) => {
                        handleLoginData(e);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={(e) => {
                      handleLogin();
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </div>

              {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </a>
            </p>
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
