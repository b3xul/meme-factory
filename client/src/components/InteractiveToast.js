// React-Bootstrap imports
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';

const InteractiveToast = (props) => {
    const { message, setMessage, deleteMeme, memeIdToDelete } = props;

    return (
        <Toast className="below-nav" show={message !== ""} onClose={() => setMessage('')} >
            <Toast.Header className={(message.startsWith("Welcome") || message === "New meme created!" || message === "Meme deleted!") ? "toast-header-success" : "toast-header-danger"}>
                {message}
            </Toast.Header>
            {message.startsWith("Do you really want to delete") ?
                <Toast.Body>
                    <Button variant="danger" block onClick={() => deleteMeme(memeIdToDelete)}>Delete meme</Button>
                </Toast.Body>
                :
                <></>
            }
        </Toast>
    );
};

export default InteractiveToast;