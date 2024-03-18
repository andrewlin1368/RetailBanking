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

  const sendGetAccount = async (e) => {
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
      <button onClick={() => navigate("/")}>Exit Account Search</button>
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Account Number"
          aria-describedby="basic-addon2"
          onChange={(e) => setAccountNum({ account_id: e.target.value })}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={sendGetAccount}
          >
            Search
          </button>
        </div>
      </div>
      {loading && <>Loading...</>}
      {!loading && account && (
        <>
          {account.account.issavings ? (
            <>SAVINGS#{account.account.account_id}</>
          ) : (
            <>CHECKING#{account.account.account_id}</>
          )}
          BALANCE: {USDollar.format(Number(account.account.balance))}
          {account.transactions.length ? (
            <>
              {account.transactions.map((transaction) => {
                return (
                  <div key={transaction.transaction_id}>
                    {USDollar.format(Number(transaction.amount))} -{" "}
                    {transaction.trans_type === "deposit" ? (
                      <>DEPOSIT</>
                    ) : transaction.trans_type === "withdrawal" ? (
                      <>WITHDRAWAL</>
                    ) : transaction.trans_type === "transfer" &&
                      transaction.toaccount === transaction.account_id ? (
                      <>TRANSFER FROM {transaction.fromaccount}</>
                    ) : (
                      <>TRANSFER TO {transaction.toaccount}</>
                    )}
                    {transaction.created_at.split("T")[0]}
                  </div>
                );
              })}
            </>
          ) : (
            <>NO TRANSACTIONS</>
          )}
        </>
      )}
      <ToastContainer></ToastContainer>
    </div>
  );
}
