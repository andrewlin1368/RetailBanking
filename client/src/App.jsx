import { Provider } from "react-redux";
import { store } from "./api/store";
import Home from "./components/Home";
import Account from "./components/Account";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/account" element={<Account></Account>}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
