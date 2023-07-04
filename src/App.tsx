import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import Nav from "./components/nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewReviewForm from "./pages/new-review-form";
import ReviewList from "./pages/reviews";
import React, { useState } from "react";
import { IContext, IModalContent, IToast } from "./interfaces";
import { v4 } from "uuid";
import { Severity } from "./enums";
import DatabaseManagement from "./pages/database-management";
import Toasts from "./components/toasts";
import Review from "./pages/review";
import Modal from "./components/modal";

export const AppContext = React.createContext({} as IContext);
function App() {
  const [toasts, _setToasts] = useState<IToast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<IModalContent | null>(null);
  const removeToast = (id: string) => {
    _setToasts((prevValue) => {
      return prevValue.filter((toast) => toast.id !== id);
    });
  };

  const addToast = (message: string, severity: Severity) => {
    const id = v4();
    _setToasts([...toasts, { id: id, message: message, severity: severity }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };
  return (
    <AppContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showModal,
        setShowModal,
        modalContent,
        setModalContent,
      }}
    >
      <Toasts />
      <Modal />

      <div className={`${showModal && "modal-open"}`}>
        <Nav />
        <div className="container page-container">
          <Routes>
            <Route path="/" element={<ReviewList />} />
            <Route path="/reviews" element={<ReviewList />} />
            <Route path="/reviews/:id" element={<Review />} />
            <Route path="/reviews/:id/edit" element={<NewReviewForm />} />

            <Route path="/reviews/new" element={<NewReviewForm />} />
            <Route path="/database-management" element={<DatabaseManagement />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
