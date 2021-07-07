import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

const SelectBackground = (props) => {

    return (
        <>
            <Link to={{
                pathname: "/update",
                state: { exam: props.exam }
            }}>
                <Card border={props.meme?.isProtected ? "warning" : "success"}>
                    <Card.Title>{props.meme?.title}</Card.Title>
                    <Card.Img src={process.env.PUBLIC_URL + props.meme?.background?.path} />
                    <Card.Body>
                        <Card.Text>
                            {props.meme?.author}
                        </Card.Text>
                        <Card.Text>
                            {props.meme?.isProtected ? <><LockFill id="lock-icon" />Protected</> : <><PeopleFill id="people-icon" />Public</>}
                        </Card.Text>
                        <Row>
                            <Col><Button variant="primary" block>Copy</Button></Col>
                            <Col><Button variant="danger" block>Delete</Button></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
        </>
    );
};

export default SelectBackground;