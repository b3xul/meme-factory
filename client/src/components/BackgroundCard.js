// React imports
import { Link } from 'react-router-dom';

// React-Bootstrap imports
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

const BackgroundCard = (props) => {

    return (
        <Card>
            <Link className="clickable-section" to={{
                pathname: "/edit",
                state: { backgroundImage: props.backgroundImage, originalCreator: props.loggedCreator, loggedCreator: props.loggedCreator }
            }}>
                <Card.Body>
                    <div className="meme-container">
                        <Image className="meme-image-card" src={process.env.PUBLIC_URL + props.backgroundImage?.path} />
                        <Form spellCheck={false}>
                            {props.backgroundImage.textAreas.map((textArea, index) => {
                                if (index < props.backgroundImage.numberOfAreas) {
                                    return (
                                        <Form.Group key={`memeId-${props.backgroundImage?.imageId}-sentence-${index}`} controlId={`memeId-${props.backgroundImage?.imageId}-sentence-${index}`} >
                                            <Form.Control as="textarea" readOnly className="meme-text-area edit-meme-form-control"
                                                style={{
                                                    top: (textArea.top / 2) + "px",
                                                    left: (textArea.left / 2) + "px",
                                                    width: (textArea.width / 2) + "px",
                                                    height: (textArea.height / 2) + "px",
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
                </Card.Body>
            </Link>
        </Card>
    );
};

export default BackgroundCard;