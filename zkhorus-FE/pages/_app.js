import "@/styles/globals.css";
import  { Account } from "./index";

export default function App({ Component, pageProps }) {
  return (
    <Account.Provider>
      <Component {...pageProps} />
    </Account.Provider>
  );
}
