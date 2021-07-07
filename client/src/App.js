// React imports
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';

// React-Bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

// Custom imports
import Navigation from './components/Navigation';
import MemeCard from './components/MemeCard';
import MemeDetails from './components/MemeDetails';
import MemeEdit from './components/MemeEdit';
import SelectBackground from './components/SelectBackground';
import API from './API';
import Meme from './Meme';
import BackgroundImage from './BackgroundImage';
// custom stylesheets
import './App.css';

function App() {

  // constructor(imageId, path, numberOfSentences) 
  const back1 = new BackgroundImage(0, "/background_images/Is-This-A-Pigeon.jpg", 3);
  const back2 = new BackgroundImage(1, "/background_images/Drake-Hotline-Bling.jpg", 2);

  //constructor(id, title, path, sentences, author, isProtected)
  const meme = new Meme(0, "Meme title", back1, ["programmer", "if statement", "is this AI?"], "AngiolinoXx", false);
  const meme2 = new Meme(0, "Meme title", back2, ["se", "vuoi"], "AngiolinoXx", true);
  /* AUTHENTICATION */
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState(''); // set error message

  // check if user is authenticated;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        setCheckingAuth(false);
      } catch (err) {
        setCheckingAuth(false);
        setMessage(err.error); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
    }
    catch (err) {
      setMessage(err);
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    // setTaskList([]);
    // setDirty(true);
  };

  /* REHYDRATING LOGIC */
  // useEffect(() => {
  //   if (loggedIn && dirty) {
  //     API.getTasks(activeFilter)
  //       .then(tasks => {
  //         setTaskList(tasks);
  //         setDirty(false);
  //       })
  //       .catch(e => handleErrors(e));
  //   }
  // }, [dirty, loggedIn]);

  /* ERROR HANDLING */
  // useeffect che mostra Toast con errore quando message varia;

  return (
    <Router>
      <Container fluid>
        <Row>
          <Navigation logIn={doLogIn} setMessage={setMessage} logOut={doLogOut} loggedIn={loggedIn} user={user} checkingAuth={checkingAuth} />
        </Row>
        <Toast className="below-nav" show={message !== '' && message !== "Hidden auth error"} onClose={() => setMessage('')} >
          <Toast.Header id="toast-header">{message}</Toast.Header>
        </Toast>

        <Switch>
          <Route path={["/meme/:memeId"]}>
            <Row className="vh-100">
              <MemeDetails meme={meme}></MemeDetails>
              {/* /{useParams()} */}
            </Row>
          </Route>
          <Route path="/create">
            <Row className="vh-100">
              <Col sm={4} className="below-nav"><SelectBackground backgroundImage={back1}></SelectBackground></Col>
              <Col sm={4} className="below-nav"><SelectBackground backgroundImage={back1}></SelectBackground></Col>
              <Col sm={4} className="below-nav"><SelectBackground backgroundImage={back1}></SelectBackground></Col>
              <Col sm={4} className="below-nav"><SelectBackground backgroundImage={back1}></SelectBackground></Col>
              <Col sm={4} className="below-nav"><SelectBackground backgroundImage={back1}></SelectBackground></Col>
            </Row>
          </Route>
          <Route path="/edit">
            <Row className="vh-100">
              <MemeEdit backgroundImage={back1}></MemeEdit>
            </Row>
          </Route>
          <Route exact path="/">
            <Row className="vh-100">
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme2}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
              <Col sm={4} className="below-nav"><MemeCard meme={meme}></MemeCard></Col>
            </Row>
          </Route>
          <Route>
            <Row className="vh-100 below-nav">
              <p>Path not found</p>
            </Row>
          </Route>
        </Switch>
      </Container>
    </Router >
  );
}

export default App;
