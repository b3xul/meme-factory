import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const BackgroundCard = (props) => {

    return (
        <>
            <Link to={{
                pathname: "/edit",
                state: { backgroundImage: props.backgroundImage, creatorUsername: props.loggedUsername }
            }}>
                <Card>
                    <Card.Body>
                        <div className="meme-container">
                            <Image className="meme-image-card" src={process.env.PUBLIC_URL + props.backgroundImage?.path} />
                            <Form spellCheck={false}>
                                <Form.Group controlId="sentence-0">
                                    <Form.Control as="textarea" readOnly className="meme-text-area edit-meme-form-control"
                                        style={{
                                            // top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                            top: (props.backgroundImage?.textAreas[0]?.top / 2) + "px",
                                            left: (props.backgroundImage?.textAreas[0]?.left / 2) + "px",
                                            width: (props.backgroundImage?.textAreas[0]?.width / 2) + "px",
                                            height: (props.backgroundImage?.textAreas[0]?.height / 2) + "px",
                                        }} />
                                </Form.Group>
                                {/* <Form.Group controlId="sentence-1">
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
                        </Form.Group> */}
                            </Form>
                        </div>

                    </Card.Body>
                </Card>
            </Link>
        </>
    );
};

export default BackgroundCard;