import { FC } from 'react'
import { Provider } from "react-redux";
import configStore from "./store";
import "./app.scss";

const store = configStore();

const App:FC = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default App