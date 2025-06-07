import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import store from "@/store/store";
import { getUser } from "@/store/slices/userSlice";
import Layout from "@/components/Layout/index";
import { ThemeProvider } from '@/context/ThemeContext';
import "@/styles/global.css";
import "react-toastify/dist/ReactToastify.css";

function AppContent({ Component, pageProps }) {
  useEffect(() => {
    store.dispatch(getUser());
  }, []);

  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
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
        />
      </Layout>
    </ThemeProvider>
  );
}

function MyApp(props) {
  return (
    <Provider store={store}>
      <AppContent {...props} />
    </Provider>
  );
}

export default MyApp;