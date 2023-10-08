# blogs-be

Steps for using:
1. Take pull of the repository
2. Run `npm i` to install the dependecies.
3. Run `npm start` to satrt the local server. it will be accessible at localhost:3001

4. Signup please use following cURL request with your own details for creating a new user
5. curl --location 'http://localhost:3001/signup' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AxtnyASdUh9ARDkDKXnwZ_UMVJOD2e0k5.ITl0l6RdbxPQ1DjfrkEoKeliIy1ePoy9PVBn8ZvAxEk' \
--data-raw '{"username":"radhika@abc.com", "name":"rad", "plan":"STARTER", "password":"abc"}'

it will return a token which needs to be passed in Authorisation for other APIs.

5. GET BLOGS LIST 
curl --location 'http://localhost:3001/blogs' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTIxNmJjNDY2YzhjNWVkNWQ4MDFjNGYiLCJpYXQiOjE2OTY3NTg0OTgsImV4cCI6MTY5NzExODQ5OH0.WAvIwN_765rVT8Dt_znaClPfXlc5_Gp82VacopTAnA8' \
--header 'Cookie: connect.sid=s%3AXGOPh1fRLlMeq95JBbTq0800Tz35aLUG.vdPKy6%2BjReHB34KMV6bqzrm5bu90Qvk1gPidQa54Q2Q'

6. GET SINGLE BLOG  - use _id field from previous api to select a particular blog
curl --location 'http://localhost:3001/blogs/6521504dab3a30e712d7fe50' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTIxNmJjNDY2YzhjNWVkNWQ4MDFjNGYiLCJpYXQiOjE2OTY3NTg0OTgsImV4cCI6MTY5NzExODQ5OH0.WAvIwN_765rVT8Dt_znaClPfXlc5_Gp82VacopTAnA8' \
--header 'Cookie: connect.sid=s%3AXGOPh1fRLlMeq95JBbTq0800Tz35aLUG.vdPKy6%2BjReHB34KMV6bqzrm5bu90Qvk1gPidQa54Q2Q'

7. CREATE BLOG
   curl --location 'http://localhost:3001/blogs/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTIxNmJjNDY2YzhjNWVkNWQ4MDFjNGYiLCJpYXQiOjE2OTY3NTg0OTgsImV4cCI6MTY5NzExODQ5OH0.WAvIwN_765rVT8Dt_znaClPfXlc5_Gp82VacopTAnA8' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AXGOPh1fRLlMeq95JBbTq0800Tz35aLUG.vdPKy6%2BjReHB34KMV6bqzrm5bu90Qvk1gPidQa54Q2Q' \
--data '{"title":"Test", "content":"I am the best blog."}'
   
