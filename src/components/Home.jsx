import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="min-h-[90vh] min-w-full flex flex-col justify-center items-center">
        <div className="text-center text-xl">
          This is a MERN Authentication system <br />
          Try this out!👇<br />
          <Link to="/register"><button className="bg-blue-600 px-2 py-1 rounded-md cursor-pointer mr-2 text-sm">Register</button></Link>
          <Link to="/login"><button className="bg-blue-600 px-2 py-1 rounded-md cursor-pointer text-sm">Login</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
