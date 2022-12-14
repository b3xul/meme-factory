// React imports
import { Link } from 'react-router-dom';

// React-Bootstrap imports
import { Navbar, Button } from 'react-bootstrap';
import { FileRichtext } from 'react-bootstrap-icons';

// Custom components imports
import { LoginForm, LogoutButton } from "./Login";

const Navigation = (props) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
            <Link to="/">
                <Navbar.Brand aria-label="meme-factory logo and name">
                    <FileRichtext className="mr-1" size="32" /> meme-factory
                </Navbar.Brand>
            </Link>
            {props.checkingAuth ?
                <Navbar.Brand className="ml-sm-auto">
                    checking authentication...🐻
                </Navbar.Brand> :
                props.loggedIn ?
                    <>
                        <Link to="/create" className="ml-sm-auto">
                            <Button variant="outline-light">Create new meme</Button>
                        </Link>
                        <Navbar.Brand className="ml-sm-auto">{props.creator.username}</Navbar.Brand>
                        {/* props.creator.username should always be available since it is set before setting props.loggedIn inside checkAuth or doLogIn functions */}
                        <LogoutButton logOut={props.logOut} />
                    </>
                    :
                    <LoginForm logIn={props.logIn} setMessage={props.setMessage} />
            }
        </Navbar >
    );
};

export default Navigation;