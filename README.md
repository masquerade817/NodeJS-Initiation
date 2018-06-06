# NodeJSTest
Login System in NodeJS using ExpressJS.

#### Dependencies:
1. [`expressJS`](https://expressjs.com/)
2. [`Sequelize`](http://docs.sequelizejs.com/)
3. [`body-parser`](https://www.npmjs.com/package/body-parser)
4. [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)
5. [`cookie-parser`](https://www.npmjs.com/package/cookie-parser)
6. [`bcrypt`](https://www.npmjs.com/package/bcrypt)

You can install all of them using:  
`$ npm install express sequelize body-parser jsonwebtoken cookie-parser bcrypt`

Also, any one of the following according to your needs:  
`$ npm install --save pg pg-hstore`  
`$ npm install --save mysql2`  
`$ npm install --save sqlite3`  
`$ npm install --save tedious`

### Login System consists of following APIs:
1. `POST /user` : This api will help with user registration process. A user is defined by the following attributes:  
   a. `user_id` (primary_key)  
   b. `first_name`  
   c. `last_name`  
   d. `email`  
   e. `mobile_number`  
   f. `password`  

2. `POST /login`: This api will have mobile_number and password as post request body and upon password validation will return JWT.

3. `GET /user`: This api will be use to get USER details. This API will have authentication policy applied i.e. It will require the client to provide authentication token which can be obtained via login.

4. `PUT /user`: This api modifies USER attributes like first_name, last_name, password. Rest of the attributes are not modifiable. This API will have authentication policy applied i.e. It will require the client to provide authentication token which can be obtained via login.

### Frameworks used: 
1. `ExpressJS`: For restful API development. You will make use of router and middlewares
2. `Sequelize (MYSQL)`: For persistence (model) layer
3. `Postman`: GUI for making API request.
