import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
// import { PeopleFill, LockFill } from 'react-bootstrap-icons';

import { useLocation, Redirect } from 'react-router-dom';
import { useState } from 'react';

import Meme from './../models/Meme';

import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';



const MemeEdit = (props) => {
    const FONTS = ["Anton", "Comic Neue", "Tangerine", "Arial", "Helvetica", "Verdana", "sans-serif", "Courier New", "monospace", "Georgia", "Times New Roman", "serif"];
    const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
    const COLORS = ["black", "white", "red", "green", "blue", "yellow", "brown"];


    const location = useLocation();
    //console.log(location);
    // use controlled form components
    const [title, setTitle] = useState(location.state.meme ? location.state.meme.title : '');
    const [isProtected, setIsProtected] = useState(location.state.meme ? location.state.meme.isProtected : false);

    const [fontFamily, setFontFamily] = useState(location.state.meme ? location.state.meme.fontFamily : FONTS[0]);

    const [fontSize, setFontSize] = useState(location.state.meme ? location.state.meme.fontSize : SIZES[29]);

    const [color, setColor] = useState(location.state.meme ? location.state.meme.color : COLORS[0]);

    const initialSentencesValue = [null, null, null];
    for (let i = 0; i < 3; i++) {
        if (i < location.state.backgroundImage.numberOfAreas)
            initialSentencesValue[i] = '';
    }
    const [sentences, setSentences] = useState(location.state.meme ? location.state.meme.sentences : initialSentencesValue);

    const originalCreatorId = location.state.originalCreator.creatorId;

    const originalIsProtected = location.state.meme ? location.state.meme.isProtected : false;

    const updateSentences = (ev) => {
        const i = Number(ev.target.name.charAt(ev.target.name.length - 1)); //extract 0 from form control name "sentence-0" to identify which sentence is being updated
        //console.log(`i=${i}`);
        setSentences(oldList => {
            //console.log(oldList);
            const list = oldList.map((sentence, index) => {
                //console.log(index);
                if (index === i && sentence != null) {
                    if (ev.target.value.length < sentence.length || sentence.length < 300) // max length of each sentence will be 300 characters 
                        return ev.target.value;
                    else
                        return sentence;
                }
                else {
                    //console.log(sentence);
                    return sentence;
                }
            });
            //console.log(list);
            return list;
        });
    };
    const updateTitle = (ev) => {
        setTitle(oldTitle => {
            if (ev.target.value.length < oldTitle.length || oldTitle.length < 300) // max length of each sentence will be 300 characters 
                return ev.target.value;
            else
                return oldTitle;

        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        props.setMessage("");

        const trimmedTitle = title.trim();
        //console.log(sentences);
        const trimmedSentences = sentences.map(sentence => {
            if (sentence === null)
                return sentence;
            return sentence?.trim();
        });
        //console.log(trimmedSentences);
        /* -------------------------------------------------------------------------- */
        /*                                 Validation                                 */
        /* -------------------------------------------------------------------------- */
        let valid = true;
        if (isEmpty(trimmedTitle)) {
            valid = false;
            props.setMessage("Title can't be empty");
            return;
        }
        if (!isLength(trimmedTitle, { min: 1, max: 300 })) {  //redundant title length check
            valid = false;
            props.setMessage("Title length can't exceed 300 characters!");
            return;
        }
        if (isEmpty(trimmedSentences[0]) && isEmpty(trimmedSentences[1]) && isEmpty(trimmedSentences[2])) {
            valid = false;
            props.setMessage("At least one text area must be filled!");
            return;
        }
        for (let i = 0; i < 3; i++) {
            if ((trimmedSentences[i] !== null && !isLength(trimmedSentences[i], { min: 0, max: 300 }))) {  //redundant title length check
                valid = false;
                props.setMessage("Sentence length can't exceed 300 characters!");
                return;
            }
        }
        if (location.state.loggedCreator.creatorId !== originalCreatorId && originalIsProtected && !isProtected) {
            valid = false;
            props.setMessage("A copy of a protected meme from another creator can't be made public!");
            return;
        }
        // if () {

        //     return;
        // }
        if (valid) {
            //constructor(memeId, imageId, creatorId, creatorUsername, title, isProtected, fontFamily, fontSize, color, sentences) {
            const meme = new Meme(-1, location.state.backgroundImage.imageId, location.state.loggedCreator.creatorId, location.state.loggedCreator.username, trimmedTitle, isProtected, fontFamily, fontSize, color, trimmedSentences);
            //console.log(meme);
            props.addMeme(meme, originalCreatorId, originalIsProtected);
        }
        return;
    };

    // // SOME VALIDATION, ADD MORE!!!
    // let valid = true;
    // if (course === '' || score === '')
    //     valid = false;
    // const scorenumber = +score;
    // if (scorenumber < 18 || scorenumber > 31)
    //     valid = false;

    // if (valid) {
    //     props.addOrUpdateExam(exam);
    //     setSubmitted(true);
    // }
    // else {
    //     // show a better error message...
    //     setErrorMessage('Error(s) in the form, please fix it.');
    // }
    // };

    // const [description, setDescription] = useState(task ? task.description : '');
    // const [isImportant, setIsImportant] = useState(task ? task.important : false);
    // const [isPrivate, setIsPrivate] = useState(task ? task.private : true);
    // const [deadlineDate, setDeadlineDate] = useState((task && task.deadline) ? task.deadline.format('YYYY-MM-DD') : '');
    // const [deadlineTime, setDeadlineTime] = useState((task && task.deadline) ? task.deadline.format('HH:mm') : '');

    //console.log(location.state);
    return (
        <>
            {
                location.state ?
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
                                                            fontFamily: fontFamily,
                                                            fontSize: (fontSize) + "px",
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
                                            <Form.Group controlId="form-title">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control type="text" name="title" placeholder="Enter title" value={title}
                                                    onChange={updateTitle} required autoFocus />
                                            </Form.Group>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">
                                            Creator: {location.state.loggedCreator.username}
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">
                                            <Form.Group className="d-flex justify-content-around">
                                                <Form.Label>Visibility: </Form.Label>
                                                <Form.Check checked={!isProtected} onChange={(event) => setIsProtected(false)} inline type='radio' label='Public' name="FormPublic" disabled={location.state.loggedCreator.creatorId !== location.state.originalCreator.creatorId && location.state.meme?.isProtected} />
                                                <Form.Check checked={isProtected} onChange={(event) => setIsProtected(true)} inline type='radio' label='Protected' name="FormProtected" />
                                            </Form.Group>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">
                                            <Form.Group>
                                                <Form.Label>Font</Form.Label>
                                                <Form.Control as="select" value={fontFamily} onChange={ev => setFontFamily(ev.target.value)}>
                                                    {FONTS.map(fontFamily => <option key={fontFamily} value={fontFamily}>{fontFamily} </option>)}
                                                </Form.Control>
                                            </Form.Group>
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">
                                            <Form.Group>
                                                <Form.Label>Size</Form.Label>
                                                <Form.Control as="select" value={fontSize} onChange={ev => setFontSize(ev.target.value)}>
                                                    {SIZES.map(fontSize => <option key={fontSize} value={fontSize}>{fontSize} </option>)}
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
                                            <Button variant="primary" block onClick={handleSubmit}>Create</Button>
                                        </Col>
                                    </Row>
                                </Form >
                            </Container >
                        </Col >
                    </>
                    :
                    <Redirect to="/" />
            }
        </>
    );
};

export default MemeEdit;;