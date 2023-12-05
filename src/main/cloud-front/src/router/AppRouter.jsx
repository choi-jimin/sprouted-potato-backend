import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import MainPage from "../pages/MainPage"
import SearchPage from "../pages/SearchPage";
import BookDetailPage from "../pages/BookDetailPage";
import "../App.css";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/search/:searchWord" element={<SearchPage />} />
                <Route path="/bookdetail/:isbn" element={<BookDetailPage />} />
                <Route path="/search/" element={<SearchPage />} />
            </Route>
        </Routes>
    )
}

export default AppRouter; 