import { useSelector, useDispatch } from "react-redux";
import { LogoutBtn } from "..";
import { Link, useLocation } from "react-router-dom";
import { setSearchTerm } from "../../app/postSlice";
import Login from "../Login.jsx";
import { useState, useEffect, useRef } from "react";
import Signup from "../Signup.jsx";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const { posts, searchTerm } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  useEffect(() => {
    // Set the initial theme based on localStorage when the component mounts
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", storedTheme);
    setTheme(storedTheme);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!ref?.current?.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar bg-base-100 flex-wrap shadow-md  sm:px-4 py-4 px-2 font-[sans-serif]  tracking-wide  z-50">
      <div className="flex-1">
        <Link to="/">
          <img
            className="m-2 "
            src="/assets/Tech_logo.png"
            width="30px"
            height="30px"
          />
        </Link>
        <Link to="/">
          <p className="m-2 text-xl">Tech Update</p>
        </Link>
      </div>
      <div className="space-x-4">
        <div className="form-control">
          {authStatus &&
            (location.pathname === "/" || location.pathname === "/drafts") && (
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="md:w-auto grow"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            )}
        </div>
        
        <div
          ref={ref}
          id="collapseMenu"
          className={`lg:flex  lg:items-center ${
            menuOpen ? "block" : "hidden"
          } max-lg:fixed max-lg:inset-0 bg-base-100 max-lg:overflow-y-auto max-lg:w-[40%] max-lg:shadow-md max-lg:z-50 max-md:w-[40%] max-sm:w-[40%]`}
        >
          <button
            id="toggleClose"
            className="lg:hidden fixed top-4 max-lg:left-[37%] max-sm:left-[37%] z-[100] rounded-full p-3 "
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={theme === "light" ? "#000" : "#fff"}
              className="w-4"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <div id="collapseMenuContent" className={` ${menuOpen ? ('flex flex-col-reverse gap-2 max-w-[100%] max-lg:p-6') : ('flex flex-row gap-2')}`}>
          {authStatus && location.pathname != "/add-post" && (
            <Link to="/add-post">
              <button onClick={() => setMenuOpen(!menuOpen)}  className="btn mx-1">
                Write
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M 380.2278978388998 41.24165029469548 L 313.8388998035363 108.63654223968565 L 380.2278978388998 41.24165029469548 L 313.8388998035363 108.63654223968565 L 403.36345776031436 198.16110019646365 L 403.36345776031436 198.16110019646365 L 470.7583497053045 131.7721021611002 L 470.7583497053045 131.7721021611002 Q 479.811394891945 121.71316306483301 479.811394891945 108.63654223968565 Q 479.811394891945 95.55992141453831 470.7583497053045 85.50098231827111 L 426.4990176817289 41.24165029469548 L 426.4990176817289 41.24165029469548 Q 416.44007858546166 32.18860510805501 403.36345776031436 32.18860510805501 Q 390.286836935167 32.18860510805501 380.2278978388998 41.24165029469548 L 380.2278978388998 41.24165029469548 Z M 282.65618860510807 94.55402750491159 L 358.098231827112 19.111984282907663 L 282.65618860510807 94.55402750491159 L 358.098231827112 19.111984282907663 Q 378.21611001964635 0 403.36345776031436 0 Q 429.516699410609 0 448.6286836935167 19.111984282907663 L 492.88801571709234 63.3713163064833 L 492.88801571709234 63.3713163064833 Q 512 82.48330058939096 512 108.63654223968565 Q 512 133.78388998035362 492.88801571709234 153.901768172888 L 417.4459724950884 229.34381139489196 L 417.4459724950884 229.34381139489196 L 380.2278978388998 368.15717092337917 L 380.2278978388998 368.15717092337917 Q 367.15127701375246 410.40471512770137 325.909626719057 424.48722986247543 L 48.282907662082515 506.9705304518664 L 48.282907662082515 506.9705304518664 Q 29.17092337917485 512 14.082514734774067 497.91748526522593 Q 0 482.82907662082516 5.029469548133595 463.7170923379175 L 88.51866404715128 186.09037328094303 L 88.51866404715128 186.09037328094303 Q 101.59528487229862 144.84872298624754 143.84282907662083 131.7721021611002 L 282.65618860510807 94.55402750491159 L 282.65618860510807 94.55402750491159 Z M 285.6738703339882 126.7426326129666 L 152.8958742632613 162.9548133595285 L 285.6738703339882 126.7426326129666 L 152.8958742632613 162.9548133595285 Q 126.7426326129666 171.00196463654223 118.69548133595285 196.1493123772102 L 44.25933202357564 445.61100196463656 L 44.25933202357564 445.61100196463656 L 154.90766208251475 334.96267190569745 L 154.90766208251475 334.96267190569745 Q 145.85461689587427 319.8742632612967 145.85461689587427 301.7681728880157 Q 146.86051080550098 274.6090373280943 164.96660117878193 256.50294695481335 Q 183.07269155206288 238.3968565815324 210.23182711198427 237.3909626719057 Q 237.3909626719057 238.3968565815324 255.49705304518665 256.50294695481335 Q 273.6031434184676 274.6090373280943 274.6090373280943 301.7681728880157 Q 273.6031434184676 328.92730844793715 255.49705304518665 347.0333988212181 Q 237.3909626719057 365.139489194499 210.23182711198427 366.14538310412576 Q 192.12573673870335 366.14538310412576 178.0432220039293 357.0923379174853 L 66.38899803536346 467.74066797642433 L 66.38899803536346 467.74066797642433 L 315.8506876227898 393.3045186640471 L 315.8506876227898 393.3045186640471 Q 340.99803536345775 385.2573673870334 349.0451866404715 360.1100196463654 L 385.2573673870334 226.32612966601178 L 385.2573673870334 226.32612966601178 L 285.6738703339882 126.7426326129666 L 285.6738703339882 126.7426326129666 Z M 210.23182711198427 269.5795677799607 Q 196.1493123772102 269.5795677799607 187.09626719056973 278.6326129666012 L 187.09626719056973 278.6326129666012 L 187.09626719056973 278.6326129666012 Q 178.0432220039293 287.68565815324166 178.0432220039293 301.7681728880157 Q 178.0432220039293 315.8506876227898 187.09626719056973 324.90373280943027 Q 196.1493123772102 333.95677799607074 210.23182711198427 333.95677799607074 Q 224.31434184675834 333.95677799607074 233.3673870333988 324.90373280943027 Q 242.4204322200393 315.8506876227898 242.4204322200393 301.7681728880157 Q 242.4204322200393 287.68565815324166 233.3673870333988 278.6326129666012 Q 224.31434184675834 269.5795677799607 210.23182711198427 269.5795677799607 L 210.23182711198427 269.5795677799607 Z" />
                </svg>
              </button>
            </Link>
          )}

          {/* Dark mode implimentation */}
          <button onClick={toggleTheme} className="btn hover:scale-105 mx-1">
            {theme === "light" ? (
              // Light mode icon (Moon for switching to dark mode)

              <svg
                className="w-[30px] h-[30px] dark:text-gray-800 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Dark mode icon (Sun for switching to light mode)
              <svg
                className="w-[28px] h-[28px] text-gray-800 dark:text-white "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.1"
                  d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                />
              </svg>
            )}
          </button>

          {authStatus && (
            <div className="dropdown dropdown-end mx-1">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square avatar"
              >
                <div className="w-10 rounded">
                  <img
                    src="https://thispersondoesnotexist.com/" // TODO
                    width="20px"
                    height="20px"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded z-[1] mt-3 w-44 p-2 shadow"
              >
                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <Link to="/drafts" className="justify-between">
                    My Drafts
                    <span className="badge">
                      {
                        posts.filter((post) => post.status === "inactive")
                          .length
                      }
                    </span>
                  </Link>
                </li >
                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <LogoutBtn />
                </li>
              </ul>
            </div>
          )}

          {!authStatus && (
            <>
              <button
                onClick={() => {
                  document.getElementById("signup").showModal();
                  document.getElementById("login").close();
                }}
                className="btn mx-2"
              >
                Signup
              </button>
              <dialog id="Signup" className="modal">
                <div className="modal-box">
                  <Signup />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>Close</button>
                </form>
              </dialog>

              <button
                onClick={() => document.getElementById("login").showModal()}
                className="btn"
              >
                Login
              </button>
              <dialog id="login" className="modal">
                <div className="modal-box">
                  <Login />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>Close</button>
                </form>
              </dialog>
            </>
          )}
          </div>
        </div>
        <button
          id="toggleOpen"
          className="lg:hidden dark:text-white"
          onClick={handleClick}
        >
          {!menuOpen ? (<svg
            className="w-10 h-14"
            fill={theme === "light" ? "#000" : "#fff"}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>) : null}

          
        </button>
      </div>
    </div>
  );
};

export default Header;
