## Email Service API
#### An Email Cleaner service built for myself

## Technologies Used
* bun
* javascript
* google APIs

## Description
_A Tiny Email service API with the goal of completely helping me clean my inbox, Temu's email can be really annoying and they have eaten most of my free google cloud storage. Also, emails from 5-6 years ago needs wiping._

## Setup/Installation
1. Clone the repo
```
git clone https://github.com/Emzzy241/email-cleaner.git
```

2. Install all dependencies with bun
```
bun install
```

3. Copy the contents of .env.example file into a new .env file and provide details for the following.
```
PORT=3004
JWT_SECRET=jwt_secret

GOOGLE_CLIENT_ID=client_id
GOOGLE_CLIENT_SECRET=client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```
_All of this can be gotten from cloud.google.com_

4. Run the Application:
```
bun run dev
```
_Please note: The application can also be run with npm, bun is a faster and smoother alternative to npm._

5. Run the various endpoints provided in the project to help clean your mail box.
_See email-cleaner.http file for more information_


## Contact
* _GitHub: Emzzy241_