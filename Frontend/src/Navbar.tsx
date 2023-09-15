import { Container, Nav, Navbar } from "react-bootstrap";
import {
  PlusCircle,
  Lock,
  Grid,
  Github,
  QuestionCircle,
} from "react-bootstrap-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import userProfile from '../../pages/session';

const NavBar = (): JSX.Element => {
  const router = useRouter();
  const userid = userProfile.getId();
  return (
    <Navbar className="navbar" variant="light" expand="lg" collapseOnSelect>
      <Container className="global-container">
        <Navbar.Brand href="/">
          <img alt="logo" src="/logo.png" className="navbar-logo" />
          <span className="navbar-logo-text"></span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-hamburger"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link href="/">
              <a
                className={`navbar-link ${router.pathname === "/" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> About
              </a>
            </Link>
            {!userid && <Link href="/login">
              <a
                className={`navbar-link ${router.pathname === "/login" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Login
              </a>
            </Link>}
            {!userid && <Link href="/Signup">
              <a
                className={`navbar-link ${router.pathname === "/Signup" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Sign up
              </a>
            </Link>}
            {userid && <Link href="/calendar">
              <a
                className={`navbar-link ${router.pathname === "/calendar" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> My Calendar
              </a>
            </Link>}
            <Link href="/poll">
              <a
                className={`navbar-link ${router.pathname === "/poll" ? ` active` : ``
                  }`}
              >
                <PlusCircle className="navbar-link-icon" /> New poll
              </a>
            </Link>
            <Link href="/recent-polls">
              <a
                className={`navbar-link ${router.pathname === "/recent-polls" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Recent polls
              </a>
            </Link>
            {userid && <Link href="">
              <a
                className={`navbar-link ${router.pathname === "" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> {userProfile.getName()}
              </a>
            </Link>}

            {userid && <Link href="">
              <a
                className={`navbar-link ${router.pathname === "" ? ` active` : ``
                  }`}
              >
                <Grid onClick={() => {
                  userProfile.setId("");
                  userProfile.setName("");
                  window.location.href = "/"
                  router.push("/");
                }
                } className="navbar-link-icon" /> Log out
              </a>
            </Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
