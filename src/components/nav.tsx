import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IPage } from "../interfaces";
import { PiArticleMediumLight } from "react-icons/pi";
import { SiCodereview } from "react-icons/si";
import { VscNewFile } from "react-icons/vsc";
import { FaDatabase } from "react-icons/fa";

function Nav() {
  const [baseUrl] = useState<string>("/");
  const [pages] = useState<IPage[]>([
    {
      url: "/reviews",
      pageName: "Existing Reviews",
      icon: <SiCodereview />,
      active: false,
    },
    {
      url: "/reviews/new",
      pageName: "Create New Review",
      icon: <VscNewFile />,
      active: false,
    },
    {
      url: "/database-management",
      pageName: "Database Management",
      icon: <FaDatabase />,
      active: false,
    },
  ]);
  return (
    <>
      <div className="px-3 py-2 text-bg-dark border-bottom fixed-top">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <Link to={"/"} className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
              <PiArticleMediumLight size={32} /> <span className="fs-4 ms-3">Lit Review Manager</span>
            </Link>

            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              {pages.map((page: IPage, j) => (
                <li key={"page_" + j} className={`${page.active ? "active" : ""}`}>
                  <Link to={page.url} className="nav-link text-secondary">
                    {page.icon}&nbsp;{page.pageName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
