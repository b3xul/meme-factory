// React imports
import { useState } from 'react';
import isStrongPassword from 'validator/lib/isStrongPassword';

// React bootstrap imports
import { Form, Button } from 'react-bootstrap';


function LoginForm(props) {
    // values already set only for your convenience, to be substituted with '' in production
    const [username, setUsername] = useState('b3xul');
    const [password, setPassword] = useState('This is my s3cur3 pwd!1!%');

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.setMessage('');
        const credentials = { username, password };

        const valid = isStrongPassword(password);
        if (!valid) {
            props.setMessage('Password must have a min length of 8 characters, with at least 1 lowercase, 1 uppercase, 1 number, 1 symbol!');
        }
        else {
            props.logIn(credentials)
                .catch((err) => {
                    props.setMessage(err.error);
                });
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
};

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logOut} >Logout</Button>
    );
}

export { LoginForm, LogoutButton };
