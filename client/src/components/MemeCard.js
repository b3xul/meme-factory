import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

const MemeCard = (props) => {
    // const { id, title, path, sentences, author, isProtected } = props.meme;
    return (
        <Card border={props.meme?.isProtected ? "warning" : "success"}>
            <Card.Title>{props.meme?.title}</Card.Title>
            {/* <Card.Img src={process.env.PUBLIC_URL + props.meme?.background?.path} /> */}
            <Card.Body>
                <Row>
                    <Col>
                        <div className="meme-container below-nav">
                            <Image className="meme-image" src={process.env.PUBLIC_URL + props.meme?.background?.path} />
                            <Form spellCheck={false}>
                                <Form.Group controlId="sentence-0">
                                    <Form.Control as="textarea" rows={2} cols={15} readOnly style={{
                                        position: "absolute", width: "auto", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", wordWrap: "break-word", resize: "none",
                                        top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "100%", color: "white"
                                    }} value={props.meme?.sentences[0]} />
                                </Form.Group>
                                <Form.Group controlId="sentence-1">
                                    <Form.Control as="textarea" rows={1} cols={10} readOnly style={{
                                        position: "absolute", width: "auto", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", resize: "none",
                                        top: "230px", left: "430px", fontFamily: "ui-rounded", fontSize: "40px", color: "white"
                                    }} value={props.meme?.sentences[1]} />
                                </Form.Group>
                                <Form.Group controlId="sentence-2">
                                    <Form.Control as="textarea" rows={1} cols={20} readOnly style={{
                                        position: "absolute", width: "auto", backgroundColor: "transparent", border: "0", boxShadow: "none", overflow: "hidden", resize: "none",
                                        top: "550px", left: "150px", fontFamily: "ui-rounded", fontSize: "40px", color: "white"
                                    }} value={props.meme?.sentences[2]} />
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
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
    );
};

export default MemeCard;