import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../api/userSlice";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useAddAccountMutation,
  useEditUserMutation,
  useDepositMutation,
  useWithdrawalMutation,
  useTransferMutation,
} from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Account() {
  const [sendAddAccount] = useAddAccountMutation();
  const [sendEditUser] = useEditUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const { accounts, user } = useSelector((state) => state.user);
  const [show, setShow] = useState({});
  useEffect(() => {
    const loadState = () => {
      const data = {};
      for (let account of accounts) data[account.account_id] = false;
      setShow(data);
    };
    if (accounts) loadState();
  }, [accounts]);
  const logout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };
  useEffect(() => {
    if (!user) navigate("/");
    else setCurrUser({ ...user, password: "" });
  }, [user]);
  const [addAccount, setAddAccount] = useState(false);
  const [addAccountForm, setAddAccountForm] = useState({ type: "checking" });
  const setAddAccountFormData = (e) => {
    setAddAccountForm({ type: e.target.value });
  };
  const handleCloseAddAccount = () => {
    setAddAccountForm({ type: "checking" });
    setAddAccount(false);
  };
  const handleShowAddAccount = () => {
    setAddAccount(true);
  };
  const handleCloseAddAccountSend = async () => {
    await sendAddAccount(addAccountForm.type);
    setAddAccount(false);
    setAddAccountForm({ type: "checking" });
    toast.success("Account has been created!", {
      position: "top-right",
    });
  };
  const [editProfile, setEditProfile] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const handleCloseEditProfile = () => {
    setCurrUser({ ...user, password: "" });
    setEditProfile(false);
  };
  const handleShowEditProfile = () => {
    setEditProfile(true);
  };
  const handleCloseEditProfileSend = async () => {
    if (currUser.password && currUser.password.length < 8)
      return toast.error("Password must have at least 8 characters!", {
        position: "top-right",
      });
    const result = await sendEditUser({
      firstname: currUser.firstname,
      lastname: currUser.lastname,
      address: currUser.address,
      password: currUser.password,
    });
    if (result.error) {
      toast.error(result.error.data.error, {
        position: "top-right",
      });
    } else setEditProfile(false);
  };
  const editCurrUser = (e) =>
    setCurrUser({ ...currUser, [e.target.id]: e.target.value });

  const [sendTransaction, setSendTransaction] = useState({
    type: "",
    amount: "",
    account_id: "",
    to_account_id: "",
  });

  const [showTransaction, setShowTransaction] = useState(false);
  const handleCloseTransaction = () => {
    setShowTransaction(false);
    setSendTransaction({
      type: "",
      amount: "",
      account_id: "",
      to_account_id: "",
    });
  };
  const [sendDeposit] = useDepositMutation();
  const [sendWithdrawal] = useWithdrawalMutation();
  const [sendTransfer] = useTransferMutation();
  const handleCloseTransactionSend = async () => {
    if (
      !sendTransaction.account_id ||
      sendTransaction.account_id === "Select your account" ||
      sendTransaction.type === "Select an option" ||
      !sendTransaction.amount ||
      !sendTransaction.type ||
      (sendTransaction.type === "transfer" && !sendTransaction.to_account_id)
    ) {
      return toast.error("All fields are required", {
        position: "top-right",
      });
    }
    if (Number(sendTransaction.amount) < 1)
      return toast.error("Minimum amount is $1", {
        position: "top-right",
      });
    if (
      sendTransaction.type === "transfer" &&
      !Number(sendTransaction.to_account_id)
    )
      return toast.error("Invalid receiving account number", {
        position: "top-right",
      });

    let result;
    if (sendTransaction.type === "deposit") {
      result = await sendDeposit({
        account_id: Number(sendTransaction.account_id),
        amount: Number(sendTransaction.amount),
      });
    } else if (sendTransaction.type === "withdrawal") {
      result = await sendWithdrawal({
        account_id: Number(sendTransaction.account_id),
        amount: Number(sendTransaction.amount),
      });
    } else {
      result = await sendTransfer({
        account_id: Number(sendTransaction.account_id),
        amount: Number(sendTransaction.amount),
        to_account_id: Number(sendTransaction.to_account_id),
      });
    }
    if (result.error) {
      return toast.error(result.error.data.error, {
        position: "top-right",
      });
    }
    setShowTransaction(false);
    setSendTransaction({
      type: "",
      amount: "",
      account_id: "",
      to_account_id: "",
    });
  };

  const handleShowTransaction = () => {
    setShowTransaction(true);
  };

  // console.log(sendTransaction);
  return (
    <>
      <Modal show={editProfile} onHide={handleCloseEditProfile} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="display-6">
              {" "}
              <i className="bi bi-person-circle"></i> Profile.
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group row mb-3">
              <label htmlFor="Username" className="col-sm-3 col-form-label">
                Username
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  readonly
                  className="form-control-plaintext"
                  id="Username"
                  defaultValue={currUser?.username}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="SSN" className="col-sm-3 col-form-label">
                SSN
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  readonly
                  className="form-control-plaintext"
                  id="SSN"
                  defaultValue={`******${currUser?.ssn.substring(6)}`}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="firstname" className="col-sm-3 col-form-label">
                First Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  defaultValue={currUser?.firstname}
                  onChange={editCurrUser}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="lastname" className="col-sm-3 col-form-label">
                Last Name
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  defaultValue={currUser?.lastname}
                  onChange={editCurrUser}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="address" className="col-sm-3 col-form-label">
                Address
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  defaultValue={currUser?.address}
                  onChange={editCurrUser}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="password" className="col-sm-3 col-form-label">
                Password
              </label>
              <div className="col-sm-9">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  onChange={editCurrUser}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditProfile}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCloseEditProfileSend}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={addAccount} onHide={handleCloseAddAccount} centered>
        <Modal.Header>
          <Modal.Title>
            <h1 className="display-6">
              Create a new checking or savings account.
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select className="form-select" onChange={setAddAccountFormData}>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddAccount}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCloseAddAccountSend}>
            Create New Account
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTransaction} onHide={handleCloseTransaction} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="display-6">Create a Transaction.</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <select
              className="form-select mb-2"
              name="type"
              onChange={(e) =>
                setSendTransaction({ ...sendTransaction, type: e.target.value })
              }
            >
              <option defaultValue="Select an option">Select an option</option>
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>

            <select
              className="form-select mb-2"
              name="account_id"
              onChange={(e) => {
                setSendTransaction({
                  ...sendTransaction,
                  account_id: e.target.value,
                });
              }}
            >
              <option defaultValue="Select your account">
                Select your account
              </option>
              {accounts &&
                accounts.map((account) => {
                  return (
                    <option key={account.account_id} value={account.account_id}>
                      {account.account_id}
                    </option>
                  );
                })}
            </select>

            {sendTransaction.type === "transfer" && (
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="to_account_id"
                  placeholder="Enter receiving account number"
                  onChange={(e) =>
                    setSendTransaction({
                      ...sendTransaction,
                      to_account_id: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Amount
                </span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                name="amount"
                onChange={(e) => {
                  setSendTransaction({
                    ...sendTransaction,
                    amount: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTransaction}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCloseTransactionSend}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="parentSide">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-auto bg-light sticky-top">
              <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
                <a
                  className="d-block p-3 link-dark text-decoration-none"
                  title=""
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-original-title="Icon-only"
                >
                  <i className="bi bi-bank fs-1"></i>
                </a>
                <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
                  <li className="nav-item">
                    <Link
                      onClick={handleShowEditProfile}
                      className="nav-link py-3 px-2"
                      title=""
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      data-bs-original-title="Home"
                    >
                      <strong className="lead">Profile</strong>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={handleShowAddAccount}
                      className="nav-link py-3 px-2 "
                      title=""
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      data-bs-original-title="Home"
                    >
                      <strong className="lead">Account</strong>
                    </Link>
                  </li>
                  {accounts && accounts.length ? (
                    <li className="nav-item">
                      <Link
                        className="nav-link py-3 px-2"
                        title=""
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        data-bs-original-title="Home"
                        onClick={handleShowTransaction}
                      >
                        <strong className="lead">Transaction</strong>
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {user && user.isadmin && (
                    <li className="nav-item">
                      <Link
                        className="nav-link py-3 px-2"
                        title=""
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        data-bs-original-title="Home"
                        to="/admin"
                      >
                        <strong className="lead">Admin</strong>
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      onClick={logout}
                      className="nav-link py-3 px-2"
                      title=""
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      data-bs-original-title="Home"
                    >
                      <strong className="lead">Logout</strong>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm p-3 min-vh-100">
              {" "}
              <div className="rightSide">
                <h1 className="display-5" style={{ textAlign: "right" }}>
                  Welcome{" "}
                  {user &&
                    user.firstname[0].toUpperCase() +
                      user.firstname.substring(1).toLowerCase()}{" "}
                  {user &&
                    user.lastname[0].toUpperCase() +
                      user.lastname.substring(1).toLowerCase()}
                  !
                </h1>
                <hr
                  className="hr"
                  style={{
                    height: "0px",
                    border: "none",
                    borderTop: "4px solid black",
                  }}
                />
                {accounts && accounts.length ? (
                  <>
                    {accounts.map((account) => {
                      return (
                        <div key={account.account_id} className="accountBox">
                          {account.issavings ? (
                            <Link
                              className="row"
                              style={{ textDecoration: "none" }}
                            >
                              <h1
                                className="display-6 col-sm"
                                id={account.account_id}
                                onClick={(e) => {
                                  setShow({
                                    ...show,
                                    [e.target.id]: !show[e.target.id],
                                  });
                                }}
                              >
                                SAVINGS#{account.account_id}{" "}
                              </h1>
                              <h1
                                className="display-6 col-sm"
                                id={account.account_id}
                                onClick={(e) => {
                                  setShow({
                                    ...show,
                                    [e.target.id]: !show[e.target.id],
                                  });
                                }}
                              >
                                <strong
                                  id={account.account_id}
                                  className="balance"
                                  style={{ color: "#0d6efd" }}
                                  onClick={(e) => {
                                    setShow({
                                      ...show,
                                      [e.target.id]: !show[e.target.id],
                                    });
                                  }}
                                >
                                  {USDollar.format(Number(account.balance))}
                                </strong>
                              </h1>
                            </Link>
                          ) : (
                            <Link
                              className="row"
                              style={{ textDecoration: "none" }}
                            >
                              <h1
                                className="display-6 col-sm"
                                id={account.account_id}
                                onClick={(e) => {
                                  setShow({
                                    ...show,
                                    [e.target.id]: !show[e.target.id],
                                  });
                                }}
                              >
                                CHECKING#{account.account_id}
                              </h1>
                              <h1
                                className="col-sm display-6"
                                id={account.account_id}
                                onClick={(e) => {
                                  setShow({
                                    ...show,
                                    [e.target.id]: !show[e.target.id],
                                  });
                                }}
                              >
                                {" "}
                                <strong
                                  id={account.account_id}
                                  className="balance"
                                  style={{ color: "#0d6efd" }}
                                  onClick={(e) => {
                                    setShow({
                                      ...show,
                                      [e.target.id]: !show[e.target.id],
                                    });
                                  }}
                                >
                                  {USDollar.format(Number(account.balance))}
                                </strong>
                              </h1>
                            </Link>
                          )}
                          {show[account.account_id] &&
                            (account.transactions.length ? (
                              <div id={account.account_id}>
                                <div className="table-wrapper-scroll-y my-custom-scrollbar">
                                  <table className="table table-bordered table-striped mb-0">
                                    {account.transactions.map((transaction) => {
                                      return (
                                        <tbody
                                          key={transaction.transaction_id}
                                          className="lead container"
                                        >
                                          <hr
                                            style={{
                                              height: "0px",
                                              border: "none",
                                              borderTop: "2px solid black",
                                            }}
                                          ></hr>
                                          {transaction.trans_type ===
                                          "withdrawal" ? (
                                            <p
                                              className="row"
                                              style={{ margin: "auto" }}
                                            >
                                              <strong
                                                className="col-sm-3"
                                                style={{
                                                  color: "red",
                                                }}
                                              >
                                                {USDollar.format(
                                                  Number(transaction.amount)
                                                )}
                                              </strong>{" "}
                                              <strong className="fw-light col-sm-6">
                                                {transaction.trans_type.toUpperCase()}
                                              </strong>
                                              <div className="col-sm-3">
                                                <i className="bi bi-clock-history"></i>{" "}
                                                {
                                                  transaction.created_at.split(
                                                    "T"
                                                  )[0]
                                                }
                                              </div>
                                            </p>
                                          ) : transaction.trans_type ===
                                            "deposit" ? (
                                            <p
                                              className="row"
                                              style={{ margin: "auto" }}
                                            >
                                              <strong
                                                className="col-sm-3"
                                                style={{ color: "green" }}
                                              >
                                                {USDollar.format(
                                                  Number(transaction.amount)
                                                )}
                                              </strong>{" "}
                                              <strong className="fw-light col-sm-6">
                                                {" "}
                                                {transaction.trans_type.toUpperCase()}
                                              </strong>
                                              <div className="col-sm-3">
                                                <i className="bi bi-clock-history"></i>{" "}
                                                {
                                                  transaction.created_at.split(
                                                    "T"
                                                  )[0]
                                                }
                                              </div>
                                            </p>
                                          ) : transaction.trans_type ===
                                              "transfer" &&
                                            transaction.account_id ===
                                              transaction.toaccount ? (
                                            <p
                                              className="row"
                                              style={{ margin: "auto" }}
                                            >
                                              <strong
                                                className="col-sm-3"
                                                style={{ color: "green" }}
                                              >
                                                {USDollar.format(
                                                  Number(transaction.amount)
                                                )}
                                              </strong>{" "}
                                              <strong className="fw-light col-sm-6">
                                                {transaction.trans_type.toUpperCase() +
                                                  ` FROM ACC******${String(
                                                    transaction.fromaccount
                                                  ).substring(6)}`}
                                              </strong>
                                              <div
                                                className="col-sm-3"
                                                style={{ float: "right" }}
                                              >
                                                <i className="bi bi-clock-history"></i>{" "}
                                                {
                                                  transaction.created_at.split(
                                                    "T"
                                                  )[0]
                                                }
                                              </div>
                                            </p>
                                          ) : (
                                            <p
                                              className="row"
                                              style={{ margin: "auto" }}
                                            >
                                              <strong
                                                className="col-sm-3"
                                                style={{ color: "red" }}
                                              >
                                                {USDollar.format(
                                                  Number(transaction.amount)
                                                )}
                                              </strong>{" "}
                                              <strong className="fw-light col-sm-6">
                                                {transaction.trans_type.toUpperCase() +
                                                  ` TO ACC******${String(
                                                    transaction.toaccount
                                                  ).substring(6)}`}
                                              </strong>
                                              <div
                                                className="col-sm-3"
                                                style={{ float: "right" }}
                                              >
                                                <i className="bi bi-clock-history"></i>{" "}
                                                {
                                                  transaction.created_at.split(
                                                    "T"
                                                  )[0]
                                                }
                                              </div>
                                            </p>
                                          )}
                                        </tbody>
                                      );
                                    })}
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <>
                                <hr
                                  style={{
                                    height: "0px",
                                    border: "none",
                                    borderTop: "2px solid black",
                                  }}
                                ></hr>
                                <p className="lead" id={account.account_id}>
                                  NO TRANSACTIONS
                                </p>
                              </>
                            ))}
                          {/* <hr
                            style={{
                              height: "0px",
                              border: "none",
                              borderTop: "3px solid black",
                            }}
                          /> */}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <h1 className="display-5">No Accounts</h1>
                    <p className="lead">
                      Start by creating a new{" "}
                      <Link
                        style={{ textDecoration: "none" }}
                        onClick={handleShowAddAccount}
                      >
                        account
                      </Link>
                      !
                    </p>
                  </div>
                )}
              </div>
              <div className="rightRight">
                <div className="stuff">
                  <h1 className="display-6" style={{ textAlign: "center" }}>
                    Connect with me!
                  </h1>
                  <hr />
                  <div style={{ padding: "5px" }}>
                    <p className="lead mb-0">
                      Add me on LinkedIn{" "}
                      <Link>
                        <i
                          className="bi bi-linkedin fs-4"
                          onClick={() => {
                            window.open(
                              "https://www.linkedin.com/in/andrewlin1368/",
                              "_blank"
                            );
                          }}
                        ></i>
                      </Link>
                      .
                    </p>
                    <p></p>
                    <p className="lead mb-0">
                      Check out my GitHub{" "}
                      <Link>
                        <i
                          className="bi bi-github fs-4"
                          onClick={() => {
                            window.open(
                              "https://github.com/andrewlin1368",
                              "_blank"
                            );
                          }}
                        ></i>
                      </Link>
                      .
                    </p>
                    <p></p>
                    <p className="lead mb-0">
                      Send me an email{" "}
                      <Link>
                        <i
                          className="bi bi-envelope fs-4"
                          onClick={() => {
                            window.open("mailto:andrewlin1368@gmail.com?");
                          }}
                        ></i>
                      </Link>
                      .
                    </p>
                  </div>
                  <div className=" mt-4" style={{ textAlign: "center" }}>
                    <div>
                      <i className="bi bi-emoji-laughing-fill fs-1 "></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
