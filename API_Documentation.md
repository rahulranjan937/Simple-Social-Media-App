# API Documentation for Simple Social Media App

## API Endpoints

### User

#### Register

- **URL**

  /api/v1/users/register

- **Method:** `POST` 

#### Login

- **URL**

  /api/v1/users/login

- **Method:** `POST`

#### Forgot Password

- **URL**

  /api/v1/user/forgotpassword

- **Method:** `POST`

#### Reset Password

- **URL**

  /api/v1/user/resetpassword

- **Method:** `POST`

#### Change Password

- **URL**

  /api/v1/user/changepassword

- **Method:** `GET`
- **Auth Required:** `YES`

#### Logout

- **URL**

  /api/v1/user/logout

- **Method:** `GET`
- **Auth Required:** `YES`

#### Get Current User

- **URL**

  /api/v1/user/:username

- **Method:** `GET`
- **Auth Required:** `YES`

#### Get user Followers

- **URL**

  /api/v1/user/:username/followers

- **Method:** `GET`
- **Auth Required:** `YES`

#### Get user Following

- **URL**

  /api/v1/user/:username/following

- **Method:** `GET`
- **Auth Required:** `YES`

#### Follow User

- **URL**

  /api/v1/user/:username/follow

- **Method:** `GET`
- **Auth Required:** `YES`

#### Unfollow User

- **URL**

  /api/v1/user/:username/unfollow

- **Method:** `GET`
- **Auth Required:** `YES`

## Posts

#### Get All Posts

- **URL**

  /api/v1/posts

- **Method:** `GET`
- **Auth Required:** `YES`

#### Get Single Post

- **URL**

  /api/v1/post/:id

- **Method:** `GET`
- **Auth Required:** `YES`

#### Create Post

- **URL**

  /api/v1/post/create

- **Method:** `POST`
- **Auth Required:** `YES`

#### Delete Post

- **URL**

  /api/v1/post/:id

- **Method:** `DELETE`
- **Auth Required:** `YES`