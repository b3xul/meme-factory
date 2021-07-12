import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

const CopyAndDeleteButtons = (props) => {
    return (
        <Row>
            <Col>
                <Link to={{
                    pathname: "/edit",
                    state: { backgroundImage: props.backgroundImage, meme: props.meme, originalCreator: props.originalCreator, loggedCreator: props.loggedCreator }
                }}>
                    <Button variant="primary" block>Copy</Button>
                </Link>
            </Col>
            <Col>
                {(props.loggedCreator.creatorId === props.meme.creatorId) ?
                    <Button variant="danger" block onClick={() => { props.setMessage(`Do you really want to delete "${props.meme.title}"?`); props.setMemeIdToDelete(props.meme.memeId); }}>Delete</Button> :
                    <></>
                }
            </Col>
            {/* ADD MODAL */}
        </Row>
    );
};

export default CopyAndDeleteButtons;