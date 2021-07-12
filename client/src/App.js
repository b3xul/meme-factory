// React imports
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';

// React-Bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

// Custom Components imports
import Navigation from './components/Navigation';
import InteractiveToast from './components/InteractiveToast';
import MemeCard from './components/MemeCard';
import MemeDetails from './components/MemeDetails';
import MemeEdit from './components/MemeEdit';
import BackgroundCard from './components/BackgroundCard';
import API from './API';

// Custom stylesheets imports
import './App.css';

function App() {
  /* -------------------------------------------------------------------------- */
  /*                               AUTHENTICATION                               */
  /* -------------------------------------------------------------------------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [creator, setCreator] = useState(null); // contains null if !loggedIn, or {creatorId, username, email} if loggedIn
  const [checkingAuth, setCheckingAuth] = useState(true); // used to avoid redirect to / when page is refreshed and loggedIn is still false
  const [message, setMessage] = useState('');

  // check if creator is authenticated;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const creator = await API.getCreatorInfo();
        setCreator(creator);
        setLoggedIn(true);
        setCheckingAuth(false);
      } catch (err) {
        setCheckingAuth(false);
        setMessage(err.error);
      }
    };
    checkAuth();
  }, []); // runs once after the initial rendering

  const doLogIn = async (credentials) => {
    try {
      const creator = await API.logIn(credentials);
      setCreator(creator);
      setLoggedIn(true);
      setMessage(`Welcome, ${creator.username}!`);
    }
    catch (err) {
      setMessage(err.error);
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setCreator(null);
    setMessage(``);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    MEMES                                   */
  /* -------------------------------------------------------------------------- */

  const [dirty, setDirty] = useState(true);
  const [memes, setMemes] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [memeIdToDelete, setMemeIdToDelete] = useState(-1);

  useEffect(() => {
    API.loadBackgroundImages()
      .then(backgroundImages => {
        setBackgroundImages(backgroundImages);
        // console.log(backgroundImages);
        setLoadingImages(false);
      })
      .catch(err => setMessage(err.error));
  }, []);

  useEffect(() => {
    // if (dirty) {
    if (!checkingAuth && loggedIn) {
      API.loadAllMemes()
        .then(memes => {
          setMemes(memes);
          console.log(memes);
          setDirty(false);
        })
        .catch(err => setMessage(err.error));
    }
    else if (!checkingAuth && !loggedIn) {
      API.loadPublicMemes()
        .then(memes => {
          setMemes(memes);
          console.log(memes);
          setDirty(false);
        })
        .catch(err => setMessage(err.error));
    }
    // }
  }, [dirty, loggedIn, checkingAuth]);

  /* -------------------------------------------------------------------------- */
  /*                               MEME FUNCTIONS                               */
  /* -------------------------------------------------------------------------- */

  const addMeme = (meme, originalCreatorId, originalIsProtected) => {
    const { memeId, ...lighterMeme } = meme;  // avoid sending memeId=-1 since it is not used by the server
    API.addMeme(lighterMeme, originalCreatorId, originalIsProtected)
      .then(() => {
        setMessage("New meme created!");
        setDirty(true);
      })
      .catch(err => {
        setMessage(err.error);
      });
  };

  const deleteMeme = (memeId) => {
    API.deleteMeme(memeId)
      .then(() => {
        setMessage("Meme deleted!");
        setDirty(true);
      })
      .catch(err => {
        setMessage(err.error);
      });
  };

  return (
    <Router>
      <Container fluid>
        <Row>
          <Navigation logIn={doLogIn} setMessage={setMessage} logOut={doLogOut} loggedIn={loggedIn} creator={creator} checkingAuth={checkingAuth} />
        </Row>
        <Switch>
          {/* -------------------------------------------------------------------------- 
                          Protected routes: /create, /edit                             
           --------------------------------------------------------------------------  */}
          <Route path="/create">
            {checkingAuth ?
              <Row className="below-nav">
                <Col>Checking authentication...🐻</Col>
              </Row>
              :
              <>
                {loggedIn ?
                  <>
                    <Row id="create-title" className="below-nav">Select a background image</Row>
                    <Row>
                      {backgroundImages.map(backgroundImage => {
                        return (
                          <Col xs={12} sm={6} md={4} key={backgroundImage.imageId}><BackgroundCard backgroundImage={backgroundImage} loggedCreator={creator}></BackgroundCard></Col>
                        );
                      })}
                    </Row>
                  </> :
                  <Redirect to="/" />
                }
              </>
            }
          </Route>
          <Route path="/edit">
            {(dirty && !checkingAuth) ?
              <Redirect to="/" /> :
              <>
                {checkingAuth ?
                  <Row className="below-nav">
                    <Col>Checking authentication...🐻</Col>
                  </Row>
                  :
                  <>
                    {!loggedIn ?
                      <Redirect to="/" /> :
                      <>
                        <Row className="below-nav">
                          <MemeEdit setMessage={setMessage} addMeme={addMeme}></MemeEdit>
                        </Row>
                      </>
                    }
                  </>
                }
              </>
            }
          </Route>

          {/* -------------------------------------------------------------------------- 
                            Public routes: /, /meme/:memeId, /nonExistingRoute                 
            --------------------------------------------------------------------------  */}
          <Route path={["/meme/:memeId"]}>
            <Row className="below-nav">
              {/* {checkingAuth ?
                <Col>Checking authentication...🐻</Col>
                :
                <> */}
              {(dirty || loadingImages) ?
                <Col>Loading...🐻</Col> :
                <MemeDetails
                  memes={memes} backgroundImages={backgroundImages} loggedIn={loggedIn} creator={creator} setMessage={setMessage} setMemeIdToDelete={setMemeIdToDelete} />
              }
              {/* </>
              } */}
            </Row>
          </Route>
          <Route exact path="/">
            <Row className="below-nav">
              {(dirty || loadingImages) ? <Col>Loading...🐻</Col> :
                <>
                  {memes.map(meme => {
                    // console.log(meme);
                    return (
                      <Col xs={12} sm={6} md={4} key={meme.memeId}>
                        <MemeCard meme={meme} backgroundImage={backgroundImages.find(backgroundImage => backgroundImage.imageId === meme.imageId)} loggedIn={loggedIn} creator={creator} setMessage={setMessage} setMemeIdToDelete={setMemeIdToDelete} />
                      </Col>
                    );
                  })}
                </>
              }
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
        </Switch>

        <InteractiveToast message={message} setMessage={setMessage} deleteMeme={deleteMeme} memeIdToDelete={memeIdToDelete} />

      </Container>
    </Router>
  );
}

export default App;
