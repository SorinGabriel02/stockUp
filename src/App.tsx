import React from "react";

import Display from "./components/Display";
import Header from "./components/Header";
import Footer from "./components/Footer";



const App: React.FC = () => {

  return (
    <div className="app">
      <div className="content">
        <Header />
        <Display />
      </div>
      <Footer />
    </div>
  );
};

export default App;
