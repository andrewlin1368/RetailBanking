import React, { useEffect, useState } from "react";
import { useUserInfoMutation } from "../api/accountApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !user.isadmin) navigate("/");
  }, [user]);

  const [account, setAccount] = useState(null);
  const [getAccount] = useUserInfoMutation();
  const [accountNum, setAccountNum] = useState(null);
  const [loading, setloading] = useState(false);

  const sendGetAccount = async () => {
    if (!accountNum)
      return toast.error("Please enter an account number", {
        position: "top-right",
      });
    setloading(true);
    setTimeout(async () => {
      setloading(false);
      const result = await getAccount(Number(accountNum.account_id));
      if (result.error)
        return toast.error(result.error.data.error, {
          position: "top-right",
        });
      setAccount({ ...result.data });
    }, 2000);

    // setUsername(null);
  };
  return (
    <div>
      <h1 className="display-3" style={{ textAlign: "center" }}>
        Search Account
      </h1>
      <div className="mb-3" style={{ textAlign: "center" }}>
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => navigate("/")}
        >
          Exit Account Search
        </button>
      </div>
      <div
        className="input-group mb-3"
        style={{ margin: "auto", width: "75%" }}
      >
        <input
          type="number"
          className="form-control"
          placeholder="Account Number"
          aria-describedby="basic-addon2"
          onChange={(e) => setAccountNum({ account_id: e.target.value })}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="button"
            onClick={sendGetAccount}
          >
            Search
          </button>
        </div>
      </div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      {!loading && account && (
        <div className="adminAccount">
          <h1 className="display-6 row">
            <div className="col-sm">
              {account.account.issavings ? (
                <>SAVINGS#{account.account.account_id}</>
              ) : (
                <>CHECKING#{account.account.account_id}</>
              )}
            </div>
            <div className="col-sm" style={{ textAlign: "right" }}>
              Current Balance:{" "}
              {USDollar.format(Number(account.account.balance))}
            </div>
          </h1>
          {account.transactions.length ? (
            <div>
              {account.transactions.map((transaction) => {
                return (
                  <div
                    className="adminTransaction lead row mb-0"
                    key={transaction.transaction_id}
                  >
                    <p className="col-sm">
                      {USDollar.format(Number(transaction.amount))} -{" "}
                      {transaction.trans_type === "deposit" ? (
                        <span style={{ color: "green" }}>DEPOSIT</span>
                      ) : transaction.trans_type === "withdrawal" ? (
                        <span style={{ color: "red" }}>WITHDRAWAL</span>
                      ) : transaction.trans_type === "transfer" &&
                        transaction.toaccount === transaction.account_id ? (
                        <span style={{ color: "green" }}>
                          TRANSFER FROM ACC#{transaction.fromaccount}
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          TRANSFER TO ACC#{transaction.toaccount}
                        </span>
                      )}
                    </p>
                    <p className="col-sm lead" style={{ textAlign: "right" }}>
                      {transaction.created_at.split("T")[0]}{" "}
                      {transaction.created_at.split("T")[1].split(".")[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <h1 className="display-6">NO TRANSACTIONS</h1>
          )}
        </div>
      )}
      <ToastContainer></ToastContainer>
    </div>
  );
}
