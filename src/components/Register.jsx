import React, { useState } from "react";
import styles from "../styles/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: {
      state: false,
      message: "",
    },
    email: {
      state: false,
      message: "",
    },
    password: {
      state: false,
      message: "",
    },
    confirmPassword: {
      state: false,
      message: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [postDataStatus, setPostDataStatus] = useState({
    done: false,
    status: false,
    message: "",
  });

  function handleInputs(e) {
    setPostDataStatus({
      done: false,
      status: false,
      message: "",
    })
    setUserData({
      ...userData,
      [e.target.name]: e.target.value.trim(),
    });
  }

  function formValidation() {
    const newErrors = { ...errors };

    // username validation

    if (userData.username.length < 3) {
      newErrors.username = true;
    } else {
      newErrors.username = false;
    }

    // email validation

    const emailRegex = /^[a-zA-Z0-9]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

    if (!emailRegex.test(userData.email)) {
      newErrors.email = true;
    } else {
      newErrors.email = false;
    }

    // password validation
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

  async function postData() {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      let url = import.meta.env.VITE_URL

      const response = await fetch(
        `${url}/register/`,
        options
      );

      const data = await response.json();

      setLoading(false)

      setPostDataStatus({
        done: true,
        status: response.ok,
        message: data.message,
      });

    } catch (err) {
      console.log(err);
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    if (formValidation()) {
      setLoading(true)
      postData();
    }
  }

  return (
    <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center py-10">
      <section className={styles.glass}>
        <h2 className="text-2xl font-semibold text-white text-center">
          Register
        </h2>
        <form
          onSubmit={(e) => submitHandler(e)}
          className="flex flex-col gap-3 w-[90%] mb-2"
        >
          <div>
            <label htmlFor="username">UserName:</label>
            <br />
            <div className={styles.inputField}>
              <input
                name="username"
                value={userData.username}
                onChange={(e) => {
                  handleInputs(e);
                }}
                id="username"
                className="outline-none flex-1"
                type="text"
              />
              <FaUser />
            </div>
            <p
              className={`text-red-600 text-xs 
                ${errors.username.state ? "block" : "hidden"}
              `}
            >
              Username is required
            </p>
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <br />
            <div className={styles.inputField}>
              <input
                name="email"
                value={userData.email}
                onChange={(e) => {
                  handleInputs(e);
                }}
                id="email"
                className="outline-none flex-1"
                type="email"
              />
              <MdAlternateEmail />
            </div>
            <p
              className={`text-red-600 text-xs 
                ${errors.email.state ? "block" : "hidden"}
              `}
            >
              Email is required
            </p>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <br />

            <div className={styles.inputField}>
              <input
                name="password"
                value={userData.password}
                onChange={(e) => {
                  handleInputs(e);
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
              // ref={passref}
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

            <div className={styles.inputField}>
              <input
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={(e) => {
                  handleInputs(e);
                }}
                id="confirmPassword"
                className="outline-none flex-1"
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
            value="Register"
          />) :(<div className="flex justify-center items-center"><span className={styles.spinner}></span></div>)}
          
        </form>
{postDataStatus.done && <h3 className={postDataStatus.status ? "text-green-500" : "text-red-500"}>{postDataStatus.message}</h3> }

        <span className="text-xs">
          
          Already have an account{" "}
          <Link
            className="text-sm text-blue-400 underline underline-offset-2 cursor-pointer"
            to="/login"
          >
            Login
          </Link>
        </span>
      </section>
    </div>
  );
};

export default Register;
