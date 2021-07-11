import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

import { Link, Redirect, useParams } from "react-router-dom";

const MemeDetails = (props) => {
    console.log(props);
    const urlParam = useParams();
    const urlMemeId = Number(urlParam.memeId);
    console.log(urlParam);
    console.log(urlMemeId);
    const meme = props.memes.find(meme => {
        console.log(meme); console.log(meme.memeId); console.log(meme.memeId === urlMemeId); return meme.memeId === urlMemeId;
    });
    console.log(props.memes);
    console.log(meme);
    const backgroundImage = props.backgroundImages.find(image => image.imageId === meme?.imageId);
    console.log(backgroundImage);

    return (
        <>
            {/* Only loggedIn users can see protected memes */}
            {meme === undefined ? <Redirect to="/" />
                :
                <>
                    <Col>
                        <div className="meme-container">
                            <Image className="meme-image" src={process.env.PUBLIC_URL + backgroundImage?.path} />
                            <Form spellCheck={false}>
                                {backgroundImage.textAreas.map((textArea, index) => {
                                    if (index < backgroundImage.numberOfAreas) {
                                        return (
                                            <Form.Group key={`sentence-${index}`} controlId={`sentence-${index}`} >
                                                <Form.Control as="textarea" readOnly className="meme-text-area"
                                                    value={meme?.sentences[index]}
                                                    style={{
                                                        // top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                                        top: (textArea.top) + "px",
                                                        left: (textArea.left) + "px",
                                                        width: (textArea.width) + "px",
                                                        height: (textArea.height) + "px",
                                                        fontFamily: meme?.fontFamily,
                                                        fontSize: (meme?.fontSize) + "px",
                                                        color: meme?.color
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

                    </Col>
                    <Col>
                        <Container fluid className='d-flex flex-column justify-content-around h-100'>
                            <ListGroup as="ul" variant="flush" className="">
                                <ListGroup.Item as="li">
                                    <h2>Title: {meme?.title}</h2>
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    Creator: {meme?.creatorUsername}
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    Visibility: {meme?.isProtected ?
                                        <><LockFill id="lock-icon" fill="var(--warning)" /> Protected</>
                                        : <><PeopleFill id="people-icon" fill="var(--success)" /> Public</>}
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    Font: {meme?.fontFamily}
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    Size: {meme?.fontSize + "px"}
                                </ListGroup.Item>
                                <ListGroup.Item as="li">
                                    Color: {meme?.color}
                                </ListGroup.Item>
                            </ListGroup>
                            {props.loggedIn ?
                                <Row>
                                    <Col>
                                        <Link to={{
                                            pathname: "/edit",
                                            state: { backgroundImage: backgroundImage, creatorUsername: meme?.creatorUsername }
                                        }}>
                                            <Button variant="primary" block>Copy</Button>
                                        </Link>
                                    </Col>
                                    <Col><Button variant="danger" block>Delete</Button></Col>
                                    {/* ADD MODAL */}
                                </Row>
                                :
                                <></>
                            }
                        </Container>
                    </Col>
                </>
            }
        </>
    );
};

export default MemeDetails;;