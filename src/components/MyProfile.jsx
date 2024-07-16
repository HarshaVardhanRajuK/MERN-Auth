import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  let url = import.meta.env.VITE_URL

  useEffect(() => {
    async function fd() {
      try {
        let response = await fetch(`${url}/my-profile`, {
          credentials: "include",
        });
        let fetchedData = await response.json();
        if (!response.ok) {
          navigate("/login");
          throw new Error(fetchedData.message)
        }
        setData(fetchedData.user);
      } catch (err) {
        console.log(err);
      }
    }
    fd();
  }, []);

  async function handleLogout() {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };
      await fetch(`${url}/logout`, options);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center text-center text-xl py-10">
      <h1>
        Hello{" "}
        <span className="text-green-500 text-2xl">{data?.username}👋</span>
      </h1>
      You've successfully logged in👍
      <br />
      This is a protected route.
      <button
        onClick={handleLogout}
        className="text-md bg-blue-500 rounded-[4px] px-2 py-1 text-base mt-2"
      >
        <Link to="/">Logout</Link>
      </button>
    </div>
  );
};

export default MyProfile;
