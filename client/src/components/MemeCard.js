// React imports
import { Link } from 'react-router-dom';

// React-Bootstrap imports
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { PeopleFill, LockFill } from 'react-bootstrap-icons';

// Custom Components imports
import CopyAndDeleteButtons from './CopyAndDeleteButtons';

const MemeCard = (props) => {

    //imageId not needed
    const { memeId, creatorId, creatorUsername, title, isProtected, fontFamily, fontSize, color, sentences } = props.meme || {};
    const originalCreator = { creatorId, creatorUsername };

    return (
        <Card border={isProtected ? "warning" : "success"} className="meme-card" >
            <Link className="clickable-section" to={`/meme/${memeId}`}>
                <Card.Title>{title}</Card.Title>
                <Card.Body className="no-padding-top">
                    <div className="meme-container">
                        <Image className="meme-image-card" src={process.env.PUBLIC_URL + props.backgroundImage?.path} />
                        <Form spellCheck={false}>
                            {props.backgroundImage.textAreas.map((textArea, index) => {
                                if (index < props.backgroundImage.numberOfAreas) {
                                    return (
                                        <Form.Group key={`memeId-${memeId}-sentence-${index}`} controlId={`memeId-${memeId}-sentence-${index}`} >
                                            <Form.Control as="textarea" readOnly className="meme-text-area"
                                                value={sentences[index]}
                                                style={{
                                                    top: (textArea.top / 2) + "px",
                                                    left: (textArea.left / 2) + "px",
                                                    width: (textArea.width / 2) + "px",
                                                    height: (textArea.height / 2) + "px",
                                                    fontFamily: fontFamily,
                                                    fontSize: (fontSize / 2) + "px",
                                                    color: color
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
                        {creatorUsername}
                    </Card.Text>
                    <Card.Text>
                        {isProtected ?
                            <><LockFill id="lock-icon" fill="var(--warning)" /> Protected</> :
                            <><PeopleFill id="people-icon" fill="var(--success)" /> Public</>}
                    </Card.Text>
                </Card.Body>
            </Link>
            {props.loggedIn ?
                <Card.Body>
                    <CopyAndDeleteButtons backgroundImage={props.backgroundImage} meme={props.meme} originalCreator={originalCreator} loggedCreator={props.creator} setMessage={props.setMessage} setMemeIdToDelete={props.setMemeIdToDelete} />
                </Card.Body>
                :
                <></>
            }
        </Card >
    );
};

export default MemeCard;