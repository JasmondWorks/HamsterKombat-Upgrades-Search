import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <ul
      className="box"
      style={{
        display: "flex",
        gap: "1.5rem",
        listStyle: "none",
      }}
    >
      <li>
        <NavLink className={styles.link} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={styles.link} to="/add">
          Add New
        </NavLink>
      </li>
    </ul>
  );
}

export default NavBar;
