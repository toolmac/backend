# backend


## API Documentation

The following documents the current API endpoints


### announcements/get

This API returns an array of objects with the following properties each: 
- timestamp (in milliseconds)
- type (club, school, or other)
- origin (where the announcement originated from)
- originLink (link to origin, if any)
- title (announcement title)
- content (announcement content)
- announcer (person who created announcement)
- id (id of the announcement)

To use this endpoint, send a POST request with these optional parameters: 

- id (id of the announcement, if you are looking for a specific one)
- before (return filter announcements to before this timestamp in millis)
- after (return filter announcements to after this timestamp in millis)
- amount (amount of results to return, default is 10)

The result set is ordered by timestamp, in descending order

### calendar/get

This API returns an array of objects with the following properties each: 
- date (String of DD-MM-YYYY)
- day (integer day 1/2/3/4)
- type (String of "school", "break", or "weekend")
- semester (1,2,3,4,or 0)
- events (array of objects {date, startTime, endTime, name, and info})

The client sends a POST request with 2 fields: startdate object, comprising of {day, month, and year (all integers)} and days, which specifies
how many days in the calendar after `startdate` the server should send. Authorization header is required.

### profile/get

This API returns a JSON object with the following properties: 
- username
- email
- id
- firstname
- lastname
- bio

To use this endpoint, send a GET or POST request without any body, with a valid Authorization Header that has the JWT token. 

### timetable/edit

This API accepts a JSON string for the timetable (client defines format) with a valid authorization header. 

The JSON is stored in the DB for future access.

A 200 OK status is returned if the storage/update was successful

### timetable/get

This API returns the JSON string stored by the user in timetable/edit API. (Auth header required)

### user/login

Login API that requires either one of password, or email, and of course the password.

It returns: 
- accessToken (the JWT access token that expires in 20 minutes)
- refreshToken (the refresh token to obtain a new access token. this is permanent until the user logs out)

### user/logout

Returns a 200 OK status if successful. Must provide a `token` field in request body with the refresh token. 

### user/register

Must provide the following fields: 
- email
- username
- password
- firstname
- lastname

A verification email will be sent after a successful request (which returns the new user's id). You should then prompt them for a request to user/verify

### user/tokenrefresh

This API is where you refresh the access token with the refresh token

Must provide `token` field in request with refresh token, API will return a single `accessToken` field

### user/verify

POST request a single field `code` with the verification code sent through email. 

200 OK is sent if successful, otherwise a 401 Not Authorized or 500 Internal Server Error