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
          <img alt="logo" style={{ height: "60px" }} src="/logo_no_bg_footer.png" className="navbar-logo" />
          <img alt="logo" src="/logo.png" className="navbar-logo" /><br></br>
          {/* <span className="navbar-logo-text">Online Event Scheduler</span> */}
          &nbsp;&nbsp;<span><i>On-Demand Event Scheduler</i></span>

        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-hamburger"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* <Link href="/">
              <a
                className={`navbar-link ${router.pathname === "/" ? ` hover` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Home
              </a>
            </Link> */}
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
            {userid && <Link href="/homecalendar">
              <a
                className={`navbar-link ${router.pathname === "/homecalendar" ? ` active` : ``
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
            {userid && <Link href="/meeting">
              <a
                className={`navbar-link ${router.pathname === "/meeting" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> New Meeting
              </a>
            </Link>}
            {!userid && <Link href="/login">
              <a
                className={`navbar-link ${router.pathname === "/login" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> New Meeting
              </a>
            </Link>}
            <Link href="/recent-polls">
              <a
                className={`navbar-link ${router.pathname === "/recent-polls" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Recent polls
              </a>
            </Link>
            {userid && <Link href="/recent-meetings">
              <a
                className={`navbar-link ${router.pathname === "/recent-meetings" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> Recent Meetings
              </a>
            </Link>}
            {userid && <Link href="">
              <a
                className={`navbar-link ${router.pathname === "" ? ` active` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> {userProfile.getName()}
              </a>
            </Link>}
            <Link href="/about">
              <a
                className={`navbar-link ${router.pathname === "/about" ? ` hover` : ``
                  }`}
              >
                <Grid className="navbar-link-icon" /> About
              </a>
            </Link>

            {userid && <Link href="">
              <a
                className={`navbar-link ${router.pathname === "" ? ` active` : ``
                  }`}
              >
                <Grid onClick={() => {
                  userProfile.setId("");
                  userProfile.setName("");
                  userProfile.setEnddate("");
                  userProfile.setTimezone("");
                  userProfile.setRecurr_enddate("");
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
