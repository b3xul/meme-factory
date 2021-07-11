# Exam #1234: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

### Creator management
#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: authenticate the creator who is trying to login
* Request body: credentials of the creator who is trying to login

``` JSON
{
  "username": "John",
  "password": "MNM4H3seGTtiETx"
}
```

* Response: `200 OK` (success)
* Response body: authenticated user

``` JSON
{
  "creatorId": 1,
  "username": "John",
  "email": "john.doe@polito.it"
}
```
* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)
* Error body: 
``` JSON
{
  "error": "Wrong username or password"
}
```


#### check whether the creator is logged in or not

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: check if current user is logged in and get her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: authenticated user

``` JSON
{
  "creatorId": 1,
  "username": "John",
  "email": "john.doe@polito.it"
}
```

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
* Error body:
``` JSON
{
  "error": "Only authenticated users can create, copy and delete memes!"
}
```

#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: logout current user
* Request body: _None_
* Response: `200 OK` (success)

* Response body: _None_

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
* Error body:

``` JSON
{
  "error": "Only authenticated users can create, copy and delete memes!"
}
```

### Meme management
#### Get all memes

* HTTP method: `GET`  URL: `/api/memes`
* Description: Get the full list of memes or the memes that match the query filter parameter, and belong to the logged user
* Request body: _None_
* Request query parameter: _filter_ name of the filter to apply
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one meme:

``` JSON
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get meme by id

* HTTP method: `GET`  URL: `/api/memes/:id`
* Description: Get the meme corresponding to the id (if it belongs to the current logged user)
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required meme:

``` JSON
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}]
```

* Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)


### Add a new meme

* HTTP method: `POST`  URL: `/api/memes`
* Description: Add a new meme to the memes of the logged user
* Request body: description of the object to add (user propery is ignored and substituted with the id of the logged user, meme id value is not required and is ignored)

``` JSON
{
    "description": "Play hockey",
    "important": 1,
    "private": 0,
    "deadline": "2021-05-10 08:30",
    "completed": 0,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)

### Update an existing meme

* HTTP method: `PUT`  URL: `/api/memes/:id`
* Description: Update values of an existing meme (except the id) of the logged user
* Request body: description of the object to update

``` JSON
{
    "id": 20,
    "description": "Play hockey",
    "important": 1,
    "private": 0,
    "deadline": "2021-05-10 08:30",
    "completed": 0,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)


### Delete an existing meme

* HTTP method: `DELETE`  URL: `/api/memes/:id`
* Description: Delete an existing meme of the logged user
* Request body: _None_

* Response: `200 OK` (success)
* Response body: an empty object

* Error responses:  `500 Internal Server Error` (generic error)

## Database Tables

- Table `Creator` - contains
- 
| creatorId | username | email              | password        |
| --------- | -------- | ------------------ | --------------- |
| 1         | John     | john.doe@polito.it | MNM4H3seGTtiETx |

- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
