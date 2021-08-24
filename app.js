const path = require('path');

const express = require('express');

const app = express();

const PORT = 8080;

const mongoConnect = require('./utils/database').mongoConnect;

// Router
const adminRouter = require('./router/adminRouter');
const shopRouter = require('./router/shopRouter');
const errorController = require('./controller/errorController');

// Models
const User = require('./models/user');

// EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("60c9a4ad4363ade2b61e95fd")
    .then((user) => {
      console.log(user);
      req.user = new User(user._id, user.name, user.email, user.cart);
      next();
    })
    .catch(err => {
      console.log(err);
    })
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404page);

mongoConnect(() => {
  app.listen(PORT, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is listening on PORT', PORT);
    }
  });
});