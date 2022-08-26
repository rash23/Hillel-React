import {NavLink} from "react-router-dom";

const Nav = () => {
    const navLinks = ["Home", "Popular", "Battle"]

    return (
        <nav>
            <ul className="nav">
                {navLinks.map((link, index) => <li key={index}>
                    <NavLink to={link === "Home" ? "/" : link.toLowerCase()}>{link}</NavLink></li>)}
            </ul>
        </nav>);
}

export default Nav;
