import React from "react";

import Display from "./components/Display";
import Header from "./components/Header";
import Footer from "./components/Footer";

import styles from "./App.module.scss";



const App: React.FC = () => {

  return (
    <div className={styles.app}>
      <Header />
      <Display />
      <Footer />
    </div>
  );
};

export default App;
