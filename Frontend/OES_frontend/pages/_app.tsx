import { AppProps } from "next/app";
import "cal-sans";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "../src/styles/global.scss";
import "../src/styles/main_page.css"

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default App;
