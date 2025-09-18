import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import store from "@/store/store";
import { getUser } from "@/store/slices/userSlice";
import Layout from "@/components/Layout/index";
import CookieConsent from "@/components/CookieConsent";
import { ThemeProvider } from "@/context/ThemeContext";
import Loader from "@/components/Loader";
import "@/styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Head from "next/head";

function AppContent({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    store.dispatch(getUser());
  }, []);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) setLoading(true);
    };
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
    <Head>
      <meta name="google-adsense-account" content="ca-pub-3933872662333205"></meta>
    </Head>
          <Script
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3933872662333205"
        crossOrigin="anonymous"
      />
    <ThemeProvider>
      {loading && <Loader />}
      <Layout>
        <Component {...pageProps} />
        <CookieConsent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-width"
        />
      </Layout>
    </ThemeProvider>
    </>
  );
}

function MyApp(props) {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <AppContent {...props} />
      </Provider>
    </CookiesProvider>
  );
}

export default MyApp;
