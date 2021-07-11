// React imports
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// useParams

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';

// React-Bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Image from 'react-bootstrap/Image';

// Custom imports
import Navigation from './components/Navigation';
import MemeCard from './components/MemeCard';
import MemeDetails from './components/MemeDetails';
import MemeEdit from './components/MemeEdit';
import BackgroundCard from './components/BackgroundCard';
import API from './API';
// import Meme from './Meme';
// import { BackgroundImage, MemeTextArea } from './BackgroundImage';

// custom stylesheets
import './App.css';

function App() {

  return (
    <Router>
      <Main />
    </Router >
  );
}

function Main() {

  /* -------------------------------------------------------------------------- */
  /*                               AUTHENTICATION                               */
  /* -------------------------------------------------------------------------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [creator, setCreator] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState(''); // set error message

  // check if creator is authenticated;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the creator info, if already logged in
        const creator = await API.getCreatorInfo();
        setLoggedIn(true);
        setCreator(creator);
        setCheckingAuth(false);
      } catch (err) {
        setCheckingAuth(false);
        setMessage(err.error); // mostly unauthenticated creator
      }
    };
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const creator = await API.logIn(credentials);
      setLoggedIn(true);
      setCreator(creator);
    }
    catch (err) {
      setMessage(err.error);
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setCreator(null);
    // setTaskList([]);
    // setDirty(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                              REHYDRATING LOGIC                             */
  /* -------------------------------------------------------------------------- */

  const [dirty, setDirty] = useState(true);
  const [memes, setMemes] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // // constructor(top, left, width, height)
  // const areas1 = [new MemeTextArea(60, 100, 360, 120), new MemeTextArea(230, 430, 220, 60), new MemeTextArea(550, 150, 360, 60)];
  // const areas2 = [new MemeTextArea(60, 100, 360, 120), new MemeTextArea(230, 430, 220, 60), new MemeTextArea(550, 150, 360, 60)];

  // //constructor(imageId, path, textAreas)
  // const back1 = new BackgroundImage(0, "/background_images/Is-This-A-Pigeon.jpg", areas1);
  // const back2 = new BackgroundImage(1, "/background_images/Drake-Hotline-Bling.jpg", areas2);

  // // constructor(memeId, title, creator, isProtected, background, sentences, font, fontSize, color)
  // const meme = new Meme(0, "Meme title", "AngiolinoXx", false, back1, ["programmer", "if statement", "is this AI?"], "Impact", 40, "white");
  // const meme2 = new Meme(1, "Meme title", "AngiolinoXx", true, back2, ["fare un progetto easy", "creare il nuovo facebook"], "Impact", 40, "black");

  useEffect(() => {

    API.loadBackgroundImages()
      .then(backgroundImages => {
        setBackgroundImages(backgroundImages);
        console.log(backgroundImages);
        setLoadingImages(false);
      })
      .catch(err => setMessage(err.error));

  }, []);

  useEffect(() => {
    // if (dirty) {
    if (loggedIn) {
      API.loadAllMemes()
        .then(memes => {
          setMemes(memes);
          setDirty(false);

        })
        .catch(err => setMessage(err.error));
    }
    else {
      API.loadPublicMemes()
        .then(memes => {
          console.log(memes);
          setMemes(memes);
          setDirty(false);
        })
        .catch(err => setMessage(err.error));
    }
    // }
  }, [dirty, loggedIn]);

  /* ERROR HANDLING */
  // useeffect che mostra Toast con errore quando message varia;

  return (
    <Container fluid>
      <Row>
        <Navigation logIn={doLogIn} setMessage={setMessage} logOut={doLogOut} loggedIn={loggedIn} creator={creator} checkingAuth={checkingAuth} />
      </Row>
      <Switch>
        {/* -------------------------------------------------------------------------- 
                          Protected routes: /create, /edit                             
           --------------------------------------------------------------------------  */}
        < Route path="/create">
          {loggedIn ?
            <>
              <div id="create-title" className="below-nav">Select a background image</div>
              <Row>
                {backgroundImages.map(backgroundImage => {
                  return (
                    <Col xs={12} sm={6} md={4} key={backgroundImage.imageId}><BackgroundCard backgroundImage={backgroundImage} loggedUsername={creator?.username}></BackgroundCard></Col>
                  );
                })}
              </Row>
            </> :
            <Redirect to="/" />
          }
        </Route>
        <Route path="/edit">
          {loggedIn ?
            <Row className="below-nav">
              <MemeEdit></MemeEdit>
            </Row> :
            <Redirect to="/" />
          }
        </Route>

        {/* -------------------------------------------------------------------------- 
                            Public routes: /, /meme/:memeId, /nonExistingRoute                 
            --------------------------------------------------------------------------  */}
        <Route path={["/meme/:memeId"]}>
          <Row className="below-nav">
            {(dirty || loadingImages) ? <Row>Loading...🐻</Row> :
              <MemeDetails
                memes={memes} backgroundImages={backgroundImages} loggedIn={loggedIn}>
              </MemeDetails>
            }
          </Row>
        </Route>
        <Route exact path="/">
          <Row className="below-nav">
            {(dirty || loadingImages) ? <Row>Loading...🐻</Row> :
              <>
                {memes.map(meme => {
                  console.log(meme);
                  return (
                    <Col xs={12} sm={6} md={4} key={meme.memeId}>
                      <MemeCard meme={meme} backgroundImage={backgroundImages.find(backgroundImage => backgroundImage.imageId === meme.imageId)} loggedIn={loggedIn}></MemeCard>
                    </Col>
                  );
                })}
              </>
            }
            {/* <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme2} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col>
              <Col xs={12} sm={6} md={4}><MemeCard meme={meme} loggedIn={loggedIn}></MemeCard></Col> */}
          </Row>
        </Route>
        <Route>
          <Row className="below-nav">
            <Col>
              <Image src={process.env.PUBLIC_URL + "JohnTravolta404.jpg"} />
            </Col>
            <Col className="d-flex flex-column justify-content-center">
              Page not found!
            </Col>
          </Row>
        </Route>
      </Switch >
      {/* <MemeEdit2 meme={meme}></MemeEdit2> */}
      <Toast className="below-nav" show={message !== ""} onClose={() => setMessage('')} >
        <Toast.Header id="toast-header">{message}</Toast.Header>
      </Toast>
    </Container >
  );
}
export default App;
