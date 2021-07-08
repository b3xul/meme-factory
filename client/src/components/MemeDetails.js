import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

const MemeDetails = (props) => {

    return (
        <>
            <Col>
                <div className="meme-container">
                    <Image className="meme-image" src={process.env.PUBLIC_URL + props.meme?.background?.path} />
                    <Form spellCheck={false}>
                        <Form.Group controlId="sentence-0">
                            <Form.Control as="textarea" readOnly style={{
                                position: "absolute", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", wordWrap: "break-word", resize: "none",
                                // top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                top: "60px", left: "100px", width: "360px", height: "120px", fontFamily: "ui-rounded", fontSize: "40px", color: "white"
                            }} value={props.meme?.sentences[0]} />
                        </Form.Group>
                        <Form.Group controlId="sentence-1">
                            <Form.Control as="textarea" readOnly style={{
                                position: "absolute", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", resize: "none",
                                // top: "35%", left: "64%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                top: "230px", left: "430px", width: "220px", height: "60px", fontFamily: "ui-rounded", fontSize: "40px", color: "white"
                            }} value={props.meme?.sentences[1]} />
                        </Form.Group>
                        <Form.Group controlId="sentence-2">
                            <Form.Control as="textarea" readOnly style={{
                                position: "absolute", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", resize: "none",
                                // top: "90%", left: "30%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                top: "550px", left: "150px", width: "360px", height: "60px", fontFamily: "ui-rounded", fontSize: "40px", color: "white"
                            }} value={props.meme?.sentences[2]} />
                        </Form.Group>
                    </Form>
                </div>

            </Col>
            <Col>
                <Container fluid className='d-flex flex-column justify-content-around h-100'>
                    <ListGroup as="ul" variant="flush" className="">
                        <ListGroup.Item as="li">
                            <h2>Title: {props.meme?.title}</h2>
                        </ListGroup.Item>
                        <ListGroup.Item as="li">
                            Creator: {props.meme?.creator}
                        </ListGroup.Item>
                        <ListGroup.Item as="li">
                            Visibility: {props.meme?.isProtected ?
                                <><LockFill id="lock-icon" /> Protected</>
                                : <><PeopleFill id="people-icon" /> Public</>}
                        </ListGroup.Item>
                        <ListGroup.Item as="li">
                            Font: {props.meme?.font}
                        </ListGroup.Item>
                        <ListGroup.Item as="li">
                            Size: {props.meme?.size}
                        </ListGroup.Item>
                        <ListGroup.Item as="li">
                            Color: {props.meme?.color}
                        </ListGroup.Item>
                    </ListGroup>
                    <Row>
                        <Col>
                            <Button variant="primary" block>Copy</Button>
                        </Col>
                        <Col>
                            <Button variant="danger" block>Delete</Button>
                        </Col>
                    </Row>
                </Container>
            </Col>
        </>
    );
};

export default MemeDetails;