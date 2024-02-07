import "@/styles/globals.css";
import AppProvider from "./appConfig";

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
