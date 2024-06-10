import Header from "../components/header";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  
  return (
    <div className="App">
      <Header />
      <div className="main">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
