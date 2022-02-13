import { React, useState } from "react";
import { Link } from "react-router-dom";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import Notifications from "react-notifications-menu";

function Navbar({ fixed }) {
  const DEFAULT_NOTIFICATION = {
    image:
      "https://t3.ftcdn.net/jpg/01/34/49/84/360_F_134498430_vn2ciA0xKdMnxKIl1oAv4cY6qkybEBnz.webp",
    message: "Temperature Exceeding-Check it out!",
    detailPage: "/nodes",
    receivedTime: "3h ago",
  };

  const [data, setData] = useState([DEFAULT_NOTIFICATION]);

  // const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="sticky top-0 z-99 flex flex-wrap items-center px-2 py-1 bg-gray-700 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="justify-start text-sm font-bold leading-relaxed inline-block whitespace-nowrap uppercase text-white"
              href="#pablo"
            >
              <EmojiObjectsIcon className="flex items-center text-xs" />
              <span className="ml-2">Light It Up!</span>
            </a>
            {/* <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button> */}
          </div>
          <div
            className={"lg:flex flex-grow items-center"}
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <div className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75">
                  <Notifications
                    icon="https://assets.ifttt.com/images/channels/651849913/icons/monochrome_large.png"
                    data={data}
                    header={{
                      title: "Notifications",
                      option: {
                        text: "View All",
                        onClick: () => console.log("Clicked"),
                      },
                    }}
                    markAsRead={(data) => {
                      console.log(data);
                    }}
                  />
                </div>
              </li>

              <li className="nav-item">
                <Link
                  to="/nodes"
                  className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  Area Name |
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  LOGOUT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
