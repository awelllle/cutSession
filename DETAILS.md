# Design / Implementation details

This project was implemented with JavaScript/Typescript running in the Node environment. The typescript files are compiled into Javascript and are stored in the dist folder.

There's only one route/endpoint called 'howold'. It's a GET request. It takes a param called 'dob' that is a valid timestamp


The rate limiter was implemented using the express-rate-limit package. It makes use of the Sliding window counter alogorithm to limit the requests based on the parameters specified by me

It was applied via the middleware on the route