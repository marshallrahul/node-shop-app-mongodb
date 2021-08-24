const {ObjectID} = require ('mongodb');
const getDb = require ('../utils/database').getDb;

class User {
  constructor (id, username, email, cart) {
    this._id = id;
    this.name = username;
    this.email = email;
    this.cart = cart ? cart : {};
    this.cart.items = cart ? cart.items : [];
  }

  addToCart (product) {
    const cartProductIndex = this.cart.items.findIndex (cp => {
      return cp.productId.toString () === product._id.toString ();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push ({
        productId: ObjectID (product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb ();
    return db
      .collection ('users')
      .updateOne ({_id: ObjectID (this._id)}, {$set: {cart: updatedCart}});
  }

  static findById (userId) {
    const db = getDb ();
    return db.collection ('users').findOne ({_id: ObjectID (userId)});
  }

  getCarts () {
    const productIds = this.cart.items.map (i => {
      return i.productId;
    });
    const db = getDb ();
    return db
      .collection ('products')
      .find ({_id: {$in: productIds}})
      .toArray ()
      .then (products => {
        return products.map (product => {
          return {
            ...product,
            quantity: this.cart.items.find (i => {
              return i.productId.toString () === product._id.toString ();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart (productId) {
    const updatedCartItems = this.cart.items.filter (item => {
      return item.productId.toString () !== productId.toString ();
    });
    const db = getDb ();
    return db
      .collection ('users')
      .updateOne ({_id: ObjectID (this._id)}, {$set: {cart: updatedCartItems}});
  }

  addOrder () {
    const db = getDb ();
    return this.getCarts ()
      .then (products => {
        const order = {
          itms: products,
          user: {
            _id: ObjectID (this._id),
            name: this.name,
          },
        };
        return db.collection ('orders').insertOne (order);
      })
      .then (result => {
        this.cart = {items: []};
        return db
          .collection ('user')
          .updateOne ({_id: ObjectID (this._id)}, {$set: {cart: {}}});
      });
  }
}

module.exports = User;
