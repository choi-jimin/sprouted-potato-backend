import React from "react";
import Header from "../components/common/Header"
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
        <Header />
        <Outlet />
        </>
    )
}

export default Layout;