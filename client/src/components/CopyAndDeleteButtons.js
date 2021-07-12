// React imports
import { Link } from "react-router-dom";

// React-Bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const CopyAndDeleteButtons = (props) => {
    const { backgroundImage, meme, originalCreator, loggedCreator, setMessage, setMemeIdToDelete } = props;

    return (
        <Row>
            <Col>
                <Link to={{
                    pathname: "/edit",
                    state: { backgroundImage: backgroundImage, meme: meme, originalCreator: originalCreator, loggedCreator: loggedCreator }
                }}>
                    <Button variant="primary" block>Copy</Button>
                </Link>
            </Col>
            <Col>
                {(loggedCreator.creatorId === meme.creatorId) ?
                    <Button variant="danger" block onClick={() => { setMessage(`Do you really want to delete "${meme.title}"?`); setMemeIdToDelete(meme.memeId); }}>Delete</Button> :
                    <></>
                }
            </Col>
            {/* ADD MODAL */}
        </Row>
    );
};

export default CopyAndDeleteButtons;