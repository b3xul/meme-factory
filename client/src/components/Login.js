// React imports
import { useState } from 'react';

// React bootstrap imports
import { Form, Button } from 'react-bootstrap';

function LoginForm(props) {
    const [username, setUsername] = useState('John');
    const [password, setPassword] = useState('MNM4H3seGTtiETx');
    // const [show, setShow] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setMessage('');
        const credentials = { username, password };

        // basic validation: TO-DO IMPROVE!!!
        let valid = true;
        if (username === '' || password === '' || password.length < 6) {
            valid = false;
            props.setMessage('Username cannot be empty and password must be at least six character long.');
        }

        if (valid) {
            props.logIn(credentials)
                .catch((err) => { console.log("fallito"); props.setMessage(err.error); });
        }

    };

    return (
        <Form inline onSubmit={handleSubmit} className="ml-sm-auto">
            <Form.Group controlId="username">
                <Form.Label className="navigation-text">username</Form.Label>
                <Form.Control
                    className="mx-sm-2"
                    type="text"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label className="navigation-text">password</Form.Label>
                <Form.Control
                    className="mx-sm-2"
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />
            </Form.Group>
            <Button variant="outline-light" type="submit">Login</Button>
        </Form>
    );
}

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logOut} >Logout</Button>
    );
}

export { LoginForm, LogoutButton };
