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
import Button from 'react-bootstrap/Button';

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
        setCreator(creator);
        setLoggedIn(true);
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
      setCreator(creator);
      console.log(creator);
      setLoggedIn(true);
      setMessage(`Welcome, ${creator.username}!`);
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
    // exam.status = 'added';
    // setExams(oldExams => [...oldExams, exam]);

    // setUpdatedId(task.id);
    // setTaskList((oldTaskList) => [...oldTaskList, task]); // local update
    // API.addNewTask(task).then((err) => { setUpdatedId(-1); setDirty(true); });  // in case of error rehydrate
    const { memeId, ...lighterMeme } = meme;  // avoid sending memeId=-1 since it is not used by the server
    console.log(lighterMeme);
    API.addMeme(lighterMeme, originalCreatorId, originalIsProtected)
      .then((addedMeme) => {
        console.log(addedMeme);
        setMessage("New meme created!");
        setDirty(true);
      })
      .catch(err => {
        setMessage(err.error);
        setDirty(true);
      });
  };

  // // add or update a task into the list
  // const handleSaveOrUpdate = (task) => {

  //   // if the task has an id it is an update
  //   if (task.id) {
  //     API.updateTask(task)
  //       .then(() => setDirty(true))
  //       .catch(e => handleErrors(e));

  //     // otherwise it is a new task to add
  //   } else {
  //     API.addTask(task)
  //       .then(() => setDirty(true))
  //       .catch(e => handleErrors(e));
  //   }
  //   setSelectedTask(MODAL.CLOSED);
  // };

  const deleteMeme = (memeId) => {
    // exam.status = 'added';
    // setExams(oldExams => [...oldExams, exam]);

    // setUpdatedId(task.id);
    // setTaskList((oldTaskList) => [...oldTaskList, task]); // local update
    // API.addNewTask(task).then((err) => { setUpdatedId(-1); setDirty(true); });  // in case of error rehydrate

    API.deleteMeme(memeId)
      .then(() => {
        setMessage("Meme deleted!");
        setDirty(true);
      })
      .catch(err => {
        setMessage(err.error);
        setDirty(true);
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
            {checkingAuth ?
              <Row className="below-nav">
                <Col>Checking authentication...🐻</Col>
              </Row>
              :
              <>
                {loggedIn ?
                  <>
                    {!dirty ?
                      <Row className="below-nav">
                        <MemeEdit setMessage={setMessage} addMeme={addMeme}></MemeEdit>
                      </Row> :
                      <Col>Loading...🐻</Col>
                    }
                  </>
                  :
                  <Redirect to="/" />
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

        <Toast className="below-nav" show={message !== ""} onClose={() => setMessage('')} >
          <Toast.Header className={(message.startsWith("Welcome") || message === "New meme created!" || message === "Meme deleted!") ? "toast-header-success" : "toast-header-danger"}>{message}
          </Toast.Header>
          {message.startsWith("Do you really want to delete") ?
            <Toast.Body>
              <Button variant="danger" block onClick={() => deleteMeme(memeIdToDelete)}>Delete meme</Button>
            </Toast.Body>
            :
            <></>
          }
        </Toast>

      </Container >
    </Router >
  );
}

export default App;
