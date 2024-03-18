import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLoginMutation, useRegisterMutation } from "../api/userApi";
import "./home.css";
import bank from "../assets/bank.avif";

const Login = () => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [sendLoginData] = useLoginMutation();
  const navigate = useNavigate();
  const editLogin = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const sendLogin = async (e) => {
    e.preventDefault();
    if (!login.username || !login.password)
      return toast.error("Username or password cannot be empty", {
        position: "top-right",
      });
    const result = await sendLoginData({
      username: login.username,
      password: login.password,
    });
    if (result.error)
      return toast.error(result.error.data.error, {
        position: "top-right",
      });
    else navigate("/account");
  };
  return (
    <form onSubmit={sendLogin} className="homeForm">
      <h1 className="display-6 mb-3">Login</h1>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Username"
            onChange={(e) => editLogin(e)}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-12">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            onChange={(e) => editLogin(e)}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-2">
        Login
      </button>
    </form>
  );
};
const Register = () => {
  const navigate = useNavigate();
  const [register, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    address: "",
    username: "",
    password: "",
    ssn: "",
  });
  const [sendRegisterData] = useRegisterMutation();
  const setRegister = (e) =>
    setRegisterForm({ ...register, [e.target.name]: e.target.value });
  const sendRegister = async (e) => {
    e.preventDefault();
    const result = await sendRegisterData(register);
    if (result.error)
      return toast.error(result.error.data.error, {
        position: "top-right",
      });
    else navigate("/account");
  };
  return (
    <form onSubmit={sendRegister} className="homeForm">
      <h1 className="display-6 mb-3">Register</h1>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="firstname"
            placeholder="First Name"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="lastname"
            placeholder="Last Name"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="address"
            placeholder="Address"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="ssn"
            placeholder="SSN"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <div className="form-group row  mt-2 mb-2">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Username"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-12">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            onChange={(e) => setRegister(e)}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-2">
        Register
      </button>
    </form>
  );
};

export default function Home() {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    const goAccount = () => navigate("/account");
    if (token) goAccount();
  });
  const [login, setLogin] = useState(true);
  return (
    <>
      <nav className="navbar navbar-light bg-light py-3">
        <span
          className="navbar-brand mb-0 h1 lead fs-1"
          style={{ margin: "auto" }}
        >
          <i className="bi bi-cash-coin"></i> Retail Banking
        </span>
      </nav>
      <div className="parent">
        <div className="left">
          {" "}
          <img src={bank} alt="money" />
        </div>
        <div className="right">
          {(login && (
            <>
              <Login></Login>
              <p className="lead mt-3">
                Don't have an account?{" "}
                <Link
                  onClick={() => {
                    setLogin(false);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Register
                </Link>
              </p>
            </>
          )) || (
            <>
              <Register></Register>
              <p className="lead mt-3">
                Have an account?{" "}
                <Link
                  onClick={() => {
                    setLogin(true);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <nav className="navbar fixed-bottom navbar-expand-sm navbar-light bg-light">
        <div style={{ display: "flex", margin: "auto" }}>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link">
                <i
                  className="bi bi-linkedin fs-4"
                  onClick={() => {
                    window.open(
                      "https://www.linkedin.com/in/andrewlin1368/",
                      "_blank"
                    );
                  }}
                ></i>{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link">
                <i
                  className="bi bi-github fs-4"
                  onClick={() => {
                    window.open("https://github.com/andrewlin1368", "_blank");
                  }}
                ></i>{" "}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <ToastContainer></ToastContainer>
    </>
  );
}
