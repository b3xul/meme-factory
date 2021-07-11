import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
// import { PeopleFill, LockFill } from 'react-bootstrap-icons';

import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const MemeEdit = (props) => {
    const location = useLocation();

    // use controlled form components
    const [title, setTitle] = useState('');
    const [isProtected, setIsProtected] = useState(false);

    const FONTS = ["Impact", "Comic Sans MS", "DejaVu Sans Mono", "Times", "Arial", "Avantgarde", "fantasy", "cursive", "monospace", "serif", "sans-serif"];
    const [font, setFont] = useState(FONTS[0]);

    const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const [size, setSize] = useState(SIZES[29]);

    const COLORS = ["black", "white", "red", "green", "blue", "yellow", "brown"];
    const [color, setColor] = useState(COLORS[0]);

    const [sentences, setSentences] = useState(["", "", ""]);

    const updateSentences = (ev) => {
        const i = Number(ev.target.name.charAt(ev.target.name.length - 1)); //extract 0 from form control name "sentence-0" to identify which sentence is being updated
        console.log(`i=${i}`);
        setSentences(oldList => {
            console.log(oldList);
            const list = oldList.map((sentence, index) => {
                console.log(index);
                if (index === i) {
                    if (ev.target.value.length < sentence.length || sentence.length < 100) // max length of each sentence will be 100 characters 
                        return ev.target.value;
                    else
                        return sentence;
                }
                else {
                    console.log(sentence);
                    return sentence;
                }
            });
            console.log(list);
            return list;
        });
    };
    // const [description, setDescription] = useState(task ? task.description : '');
    // const [isImportant, setIsImportant] = useState(task ? task.important : false);
    // const [isPrivate, setIsPrivate] = useState(task ? task.private : true);
    // const [deadlineDate, setDeadlineDate] = useState((task && task.deadline) ? task.deadline.format('YYYY-MM-DD') : '');
    // const [deadlineTime, setDeadlineTime] = useState((task && task.deadline) ? task.deadline.format('HH:mm') : '');


    return (
        <>
            <Col>
                <div className="meme-container">
                    <Image className="meme-image" src={process.env.PUBLIC_URL + location.state.backgroundImage?.path} />
                    <Form spellCheck={false}>
                        {location.state.backgroundImage.textAreas.map((textArea, index) => {
                            if (index < location.state.backgroundImage.numberOfAreas) {
                                return (
                                    <Form.Group key={`sentence-${index}`} controlId={`sentence-${index}`} >
                                        <Form.Control as="textarea" className="meme-text-area edit-meme-form-control"
                                            name={`sentence-${index}`}
                                            value={sentences[index]}
                                            onChange={updateSentences} autoFocus
                                            style={{
                                                // top: "10%", left: "14%", fontFamily: "ui-rounded", fontSize: "150%", color: "white"
                                                top: (textArea.top) + "px",
                                                left: (textArea.left) + "px",
                                                width: (textArea.width) + "px",
                                                height: (textArea.height) + "px",
                                                fontFamily: font,
                                                fontSize: (size) + "px",
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

            </Col>
            <Col>
                <Container fluid className='d-flex flex-column justify-content-around h-100'>
                    <Form spellCheck={false}>
                        <ListGroup as="ul" variant="flush" className="">
                            <ListGroup.Item as="li">
                                <Form.Group controlId="form-description">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" placeholder="Enter title" value={title}
                                        onChange={(ev) => setTitle(ev.target.value)} required autoFocus />
                                    <Form.Control.Feedback type="invalid">
                                        Please insert a title
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {/* <h2>Title: </h2> */}
                            </ListGroup.Item>
                            <ListGroup.Item as="li">
                                Creator: {location.state.creatorUsername}
                            </ListGroup.Item>
                            <ListGroup.Item as="li">
                                <Form.Group className="d-flex justify-content-around">
                                    <Form.Check checked={!isProtected} onChange={(event) => setIsProtected(false)} inline type='radio' label='Public' name="FormPublic" />
                                    <Form.Check checked={isProtected} onChange={(event) => setIsProtected(true)} inline type='radio' label='Protected' name="FormProtected" />
                                </Form.Group>
                                {/* Visibility: {props.meme?.isProtected ?
                                    <><LockFill id="lock-icon" fill="var(--warning)" /> Protected</>
                                    : <><PeopleFill id="people-icon" fill="var(--success)" /> Public</>} */}
                            </ListGroup.Item>
                            <ListGroup.Item as="li">
                                <Form.Group>
                                    <Form.Label>Font</Form.Label>
                                    <Form.Control as="select" value={font} onChange={ev => setFont(ev.target.value)}>
                                        {FONTS.map(font => <option key={font} value={font}>{font} </option>)}
                                    </Form.Control>
                                </Form.Group>
                            </ListGroup.Item>
                            <ListGroup.Item as="li">
                                <Form.Group>
                                    <Form.Label>Size</Form.Label>
                                    <Form.Control as="select" value={size} onChange={ev => setSize(ev.target.value)}>
                                        {SIZES.map(size => <option key={size} value={size}>{size} </option>)}
                                    </Form.Control >
                                </Form.Group >
                            </ListGroup.Item >
                            <ListGroup.Item as="li">
                                <Form.Group>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control as="select" value={color} onChange={ev => setColor(ev.target.value)}>
                                        {COLORS.map(color => <option key={color} value={color}>{color} </option>)}
                                    </Form.Control>
                                </Form.Group>
                            </ListGroup.Item>
                        </ListGroup >
                        <Row>
                            <Col>
                                <Button variant="primary" block>Create</Button>
                            </Col>
                        </Row>
                    </Form >
                </Container >
            </Col >
        </>
    );
};

export default MemeEdit;