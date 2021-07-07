// React bootstrap imports
import { Navbar, Button } from 'react-bootstrap';
import { FileRichtext } from 'react-bootstrap-icons';

// Custom components imports
import { LoginForm, LogoutButton } from "./Login";

const Navigation = (props) => {

    return (
        <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
            <Navbar.Brand href="/" aria-label="meme-factory logo and name">
                <FileRichtext className="mr-1" size="32" /> meme-factory
            </Navbar.Brand>

            {/* className="my-2 my-lg-0 mx-auto d-none d-sm-block" action="#" role="LogIn" */}
            {props.checkingAuth ?
                <Navbar.Brand className="ml-sm-auto">
                    checking authentication...
                </Navbar.Brand> :
                props.loggedIn ?
                    <>
                        <Button className="ml-sm-auto" variant="outline-light" onClick={props.create} >Create new meme</Button>
                        <Navbar.Brand className="ml-sm-auto">{props.user && props.user.username}</Navbar.Brand>
                        <LogoutButton logOut={props.logOut} />
                    </>
                    :
                    <LoginForm logIn={props.logIn} setMessage={props.setMessage} />
            }

            {/*  <Form inline aria-label="username /email">
                <Form.Control className="mr-sm-2" type="search" placeholder="Search" aria-label="Search query" />
            </Form>

            <Form inline aria-label="username/email">
                <Form.Control className="mr-sm-2" type="search" placeholder="Search" aria-label="Search query" />
            </Form>
            <Nav className="ml-md-auto">
                <Nav.Item>
                    <Nav.Link href="#">
                        <PersonCircle size="30" />
                    </Nav.Link>
                </Nav.Item >
            </Nav >  */}
        </Navbar >
    );
};

export default Navigation;