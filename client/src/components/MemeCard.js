import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

import { Link } from 'react-router-dom';

// import { useState } from 'react';

const MemeCard = (props) => {
    // const [highlightedCard, setHighlightedCard] = useState(false);
    // const { creatorId, title, path, sentences, author, isProtected } = props.meme;
    return (
        <Card border={props.meme?.isProtected ? "warning" : "success"} className="meme-card" >
            <Link className="clickable-section" to={{
                pathname: "/meme/" + props.meme.memeId
                // ,state: { meme: props.meme }
            }}>
                {/*onMouseOver={setHighlightCard(props.meme?.memeId)} bg={highlightCard ? "primary" : ""} */}
                <Card.Title>{props.meme?.title}</Card.Title>
                {/* <Card.Img src={process.env.PUBLIC_URL + props.backgroundImage?.path} /> */}
                <Card.Body className="no-padding-top">
                    <div className="meme-container">
                        <Image className="meme-image-card" src={process.env.PUBLIC_URL + props.backgroundImage?.path} />
                        <Form spellCheck={false}>
                            {props.backgroundImage.textAreas.map((textArea, index) => {
                                if (index < props.backgroundImage.numberOfAreas) {
                                    return (
                                        <Form.Group key={`memeId-${props.meme?.memeId}-sentence-${index}`} controlId={`memeId-${props.meme?.memeId}-sentence-${index}`} >
                                            <Form.Control as="textarea" readOnly className="meme-text-area"
                                                value={props.meme?.sentences[index]}
                                                style={{
                                                    // top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                                    top: (textArea.top / 2) + "px",
                                                    left: (textArea.left / 2) + "px",
                                                    width: (textArea.width / 2) + "px",
                                                    height: (textArea.height / 2) + "px",
                                                    fontFamily: props.meme?.fontFamily,
                                                    fontSize: (props.meme?.fontSize / 2) + "px",
                                                    color: props.meme?.color
                                                }} />
                                        </Form.Group>
                                    );
                                }
                                else
                                    return <></>;

                            })
                            }
                        </Form>
                    </div>
                    <Card.Text>
                        {props.meme?.creatorUsername}
                    </Card.Text>
                    <Card.Text>
                        {props.meme?.isProtected ?
                            <><LockFill id="lock-icon" fill="var(--warning)" /> Protected</> :
                            <><PeopleFill id="people-icon" fill="var(--success)" /> Public</>}
                    </Card.Text>
                </Card.Body>
            </Link>
            {
                props.loggedIn ?
                    <Card.Body>
                        <Row>
                            <Col>
                                <Link to={{
                                    pathname: "/edit",
                                    state: { backgroundImage: props.backgroundImage, creatorUsername: props.meme?.creatorUsername }
                                }}>
                                    <Button variant="primary" block>Copy</Button>
                                </Link>
                            </Col>
                            <Col><Button variant="danger" block>Delete</Button></Col>
                            {/* ADD MODAL */}
                        </Row>
                    </Card.Body>
                    :
                    <></>
            }
        </Card >
    );
};

export default MemeCard;