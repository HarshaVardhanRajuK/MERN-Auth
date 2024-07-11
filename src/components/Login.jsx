import React, { useRef, useState } from "react";
import styles from "../styles/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: {
        state: false,
        message: ""
    },
    password: {
        state: false,
        message: ""
    },
  });

  const [postDataStatus, setPostDataStatus] = useState({
    done: false,
    status: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate()

  function handleInputs(e) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  }

  function formValidation() {
    const newErrors = { ...errors };

    // email validation

    const emailRegex = /^[a-zA-Z0-9]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

    if (!emailRegex.test(userData.email)) {
      newErrors.email.state = true;
    } else {
      newErrors.email.state = false;
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
        credentials: "include",
        body: JSON.stringify(userData),
      };

      let url = import.meta.env.VITE_URL

      const response = await fetch(`${url}/login`, options);

      const data = await response.json();

      console.log(response)
      console.log(response.cookies)

      if(!response.ok) {
        setPostDataStatus({
          done: true,
          status: response.ok,
          message: data.message,
        });
      }

      if (response.ok) {
        navigate("/my-profile")
      }
      


    } catch (err) {
      console.log(err);
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    if(formValidation()) {
      postData()
    }
  }

  return (
    <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center py-10">
      <section className={styles.glass}>
        <h2 className="text-2xl font-semibold text-white text-center">
          Login
        </h2>
        <form
          onSubmit={(e) => submitHandler(e)}
          className="flex flex-col gap-3 w-[90%] mb-2"
        >
          
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
              {errors.email.message}
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
            className={`text-red-600 text-xs 
                ${errors.password.state ? "block" : "hidden"}
              `}
            >
              {errors.password.message}
            </p>
          </div>

          <input
            type="submit"
            className="w-full bg-blue-500 py-1 rounded-md cursor-pointer"
            value="Login"
          />

          <Link className="text-xs text-blue-500 underline underline-offset-2 cursor-pointer" to="/forgot-password">Forgot Password</Link>
        </form>

        {postDataStatus.done && <h3 className={postDataStatus.status ? "text-green-500" : "text-red-500"}>{postDataStatus.message}</h3> }

        <span className="text-xs">
          Don't have an account{" "}
          <Link
            className="text-sm text-blue-400 underline underline-offset-2 cursor-pointer"
            to="/register"
          >
            Register here
          </Link>
        </span>
      </section>
    </div>
  );
};

export default Login;
