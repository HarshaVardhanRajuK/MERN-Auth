import React from "react";
import styles from "../styles/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ForgotPassword = () => {
  const [isValid, setIsValid] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    error: {
      state: false,
      message: "",
    },
    otpSent: {
      state: false,
      message: "",
    },
  });
  const [otp, setOtp] = useState({
    value: "",
    error: {
      state: false,
      message: "",
    },
  });
  
  const navigate = useNavigate();

  async function getotp() {
    try {

      setOtp({
        value: "",
        error: {
          state: false,
          message: "",
        },
      })
      
      let options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email }),
      };

      let url = import.meta.env.VITE_URL

      let response = await fetch(`${url}/getotp`, options);

      console.log(response);

      let data = await response.json();

      console.log(data);

      if (response.ok) {
        setIsValid(true);
        setUserData({
          ...userData,
          error: {
            state: false,
            message: "",
          },
          otpSent: {
            state: true,
            message: data.message,
          },
        });
      } else {
        setIsValid(false);
        setUserData({
          ...userData,
          error: {
            state: true,
            message: data.message,
          },
          otpSent: {
            state: false,
            message: "",
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function validateEmail() {
    const emailRegex = /^[a-zA-Z0-9]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

    const newUserData = { ...userData };
    
    let result = true;
  
    if (!emailRegex.test(userData.email)) {
      newUserData.error = {
        state: true,
        message: "Enter Valid email",
      };
      result = false;
      setUserData(newUserData);
    } else {
      newUserData.error = {
        state: false,
        message: "",
      };
      setUserData(newUserData);
    }

    return result
    
  }

  function handleSubmit(e) {
    e.preventDefault();

    if(validateEmail() ){
      getotp();
    }
  }

  async function otpSubmitHandler(e) {
    e.preventDefault();

    try {
      if (otp.value.length !== 4) {
        setOtp((prev) => ({
          ...prev,
          error: {
            state: true,
            message: "Enter Valid Credentials",
          },
        }));
        return;
      }else if(!validateEmail()) {
        return
      }
      else {
        setOtp((prev) => ({
          ...prev,
          error: {
            state: false,
            message: "",
          },
        }));
      }

      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, otp: otp.value }),
      };

      let url = import.meta.env.VITE_URL

      let response = await fetch(`${url}/verifyotp`, options);

      let data = await response.json();

      if (response.ok) {
        navigate(`/reset-password/${data.userId}`);
      } else {
        setOtp((prev) => ({
          ...prev,
          error: {
            state: true,
            message: data.message,
          },
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center">
      <section className={styles.glass}>
        <h2 className="text-2xl font-semibold text-white text-center">
          Forgot Password
        </h2>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-3 w-[90%] mb-2"
        >
          <div>
            <label htmlFor="email">Email:</label>
            <br />
            <div>
              <input
                id="email"
                name="email"
                onChange={(e) => {
                  if (userData.error.state) {
                    setUserData((prev) => ({
                      ...prev,
                      error: { ...prev.error, state: false },
                    }));
                  }
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
                className={styles.inputField}
                type="email"
              />
            </div>
            <p
              className={`text-red-600 text-xs 
                ${userData.error.state ? "block" : "hidden"}
              `}
            >
              {userData.error.message}
            </p>
          </div>

          <input
            type="submit"
            value="Send OTP"
            className="w-full bg-blue-500 py-1 rounded-md cursor-pointer"
          />
        </form>
        {/* otp */}
        {
          <form
            onSubmit={(e) => otpSubmitHandler(e)}
            className="flex
             flex-col gap-2"
          >
            <div className="mt-4">
              <label htmlFor="password">Enter OTP:</label>
              <br />

              <div className={styles.inputField}>
                <input
                  onChange={(e) => {

                    setOtp((prev) => {

                      return {
                        ...prev,
                        value: e.target.value,
                        error: {
                          state: false,
                          message: "",
                        }
                      };
                    });
                  }}
                  name="otp"
                  id="otp"
                  className="outline-none flex-1"
                  type="number"
                  value={otp.value}
                />
              </div>
            </div>
            <input
              type="submit"
              className="w-full bg-blue-500 py-1 rounded-md cursor-pointer"
            />
            {userData.otpSent.state && (
              <p className="text-green-500">{userData.otpSent.message}</p>
            )}
          </form>
        }

        {otp.error.state && (
          <div className="text-xs text-red-500">{otp.error.message}</div>
        )}

        <div>
          <p className="text-xs mb-1">
            Don't have an account?{" "}
            <Link
              className="text-sm text-blue-400 underline underline-offset-2 cursor-pointer"
              to="/register"
            >
              Register here
            </Link>
          </p>

          <p className="text-xs">
            Already have an account?{" "}
            <Link
              className="text-sm text-blue-400 underline underline-offset-2 cursor-pointer"
              to="/login"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
