import React, { useState } from "react";
import styles from "../styles/Register.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const [userData, setUserData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  let { userId } = useParams();

  const [errors, setErrors] = useState({
    password: {
      state: false,
      message: "",
    },
    confirmPassword: {
      state: false,
      message: "",
    },
    submitError: {
      state: false,
      message: "",
    },
  });

  async function postData() {

    try {
      let options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: userData.password }),
      };

      let url = import.meta.env.VITE_URL

      const response = await fetch(
        `${url}/reset-password/${userId}`,
        options
      );
      const data = await response.json();
      setLoading(false)

      if (response.ok) {
        alert("Password reset successfully");
        navigate("/login");
      } else {
        setErrors((prev) => ({
          ...prev,
          submitError: {
            state: true,
            message: data.message,
          },
        }));
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleInputs() {
    
    const newErrors = { ...errors };

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(userData.password)) {
      newErrors.password.state = true;
      newErrors.password.message =
        "password should contain min 6 chars including caps, small, numbers, special chars";
    } else {
      newErrors.password.state = false;
      newErrors.password.message = "";
    }

    if (userData.confirmPassword === "") {
      newErrors.confirmPassword.state = true;
      newErrors.confirmPassword.message = "confirm password is required";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword.state = true;
      newErrors.confirmPassword.message = "passwords do not match";
    } else {
      newErrors.confirmPassword.state = false;
      newErrors.confirmPassword.message = "";
    }

    let result = true;

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key].state) {
        result = false;
      }
    });

    setErrors(newErrors);

    return result;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!handleInputs()){
      return;
    }
    setLoading(true)
    postData();
  }

  return (
    <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center">
      <section className={styles.glass}>
        <h2 className="text-2xl font-semibold text-white text-center">
          Reset Password
        </h2>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-3 w-[90%] mb-2"
        >
          <div>
            <label htmlFor="password">Password:</label>
            <br />

            <div className={styles.inputField}>
              <input
                name="password"
                value={userData.password}
                onChange={(e) => {
                  setUserData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                id="password"
                className="outline-none flex-1"
                type={showPassword ? "text" : "password"}
              />
              {showPassword ? (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                >
                  {" "}
                  <FaEye />
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                >
                  <FaEyeSlash />
                </span>
              )}
            </div>
            <p
              className={`text-red-600 text-xs 
                ${errors.password.state ? "block" : "hidden"}
              `}
            >
              {errors.password.message}
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <br />
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className={styles.inputField}
                type="password"
              />
            </div>
            <p
              className={`text-red-600 text-xs 
                ${errors.confirmPassword.state ? "block" : "hidden"}
              `}
            >
              {errors.confirmPassword.message}
            </p>
          </div>

          {!loading ? (<input
            type="submit"
            className="w-full bg-blue-500 py-1 rounded-md cursor-pointer"
          />) : (<div className="flex justify-center items-center"><span className={styles.spinner}></span></div>)}
        </form>

        {errors.submitError.state && <div className="text-red-500 text-xs">
          {errors.submitError.message}
        </div>}

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

export default ResetPassword;
