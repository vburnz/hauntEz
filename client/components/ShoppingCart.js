import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fillCart, buyStuff, deleteFromOrder, addToOrders} from '../store'
import Checkout from './Checkout';

const isLoggedIn = false; 

class ShoppingCart extends Component {

  constructor() {
    super()
    this.state = {
      totalAmount: 0,
      totalQuantity: 0,
      itemsAllAvailable: true,
      userCart: null
    }
    this.submitOrder = this.submitOrder.bind(this)
    this.handleDelete = this.handleDelete.bind(this); 
    this.setInitialState = this.setInitialState.bind(this);
  }

  setInitialState() {
    let totalAmount = 0;
    let totalQuantity = 0;
    let itemsAllAvailable = true;
  
    for(let i = 0; i < this.props.cart.length; i++) {
      let currItem = this.props.cart[i];
     
      totalAmount += (currItem.location.price * currItem.quantity);
      totalQuantity += currItem.quantity;
      if(currItem.quantity > currItem.location.quantity) {
        itemsAllAvailable = false;
      }
    }
   
    this.setState({
      totalAmount,
      totalQuantity,
      itemsAllAvailable
    });
 }

  async componentDidMount() {
    if (isLoggedIn){ 
      await this.props.fillCart()
    }
    else { 
      this.setState({userCart: JSON.parse(localStorage.getItem('cart'))}); 
      console.log('state', this.state); 
      console.log('state cart', this.state.userCart); 
    }
    this.setInitialState();
  }

  async handleDelete(itemId){ 
    if (isLoggedIn){ 
      await this.props.deleteFromOrder(itemId)
    }
    else { 
      let cart = JSON.parse(localStorage.getItem('cart'))
      delete cart[itemId]; 
      localStorage.setItem('cart', JSON.stringify(cart)); 
      this.setState({userCart: cart})
    }
    this.setInitialState();
  }

  async updateDatabase(){ 
    let cartObj = this.state.userCart; 

      for (let key in cartObj) { 
        if (cartObj.hasOwnProperty(key)){ 
          const itemObj = cartObj[key]
          const newObj = { 
            price: itemObj.price, 
            locationId: itemObj.id, 
            quantity: itemObj.quantity, 
            userId: 999
          }
          await this.props.addToOrders(itemObj.price, itemObj.id, 999, itemObj.quantity); 
          //then need to update the status on this
        }
      }
      localStorage.clear(); 
      this.setState({userCart: null})
      console.log('state', this.state)
  }

  async submitOrder() {
    if (isLoggedIn) { 
      await this.props.buyStuff('Processing')
    }
    this.setInitialState();
  }

  render() {
    let cart = null; 
    if (isLoggedIn) { 
      cart = this.props.cart
    } else {
      //map through object keys and push into array 
      cart = []; 
      let cartObj = this.state.userCart; 
      for (let key in cartObj) { 
        if (cartObj.hasOwnProperty(key)){ 
          cart.push(cartObj[key]); 
        }
      }
    }

    return (
      <div>
        <div className="shopping-cart">         
          {cart ? ( 
            cart.map(item => {
       
            return (
              item.location ? (
              <div key={item.id}>
              <h2 >
                {item.location.address} for ${item.location.price} x {item.quantity} = ${item.location.price*item.quantity}
                {(item.quantity > item.location.quantity) ?
                <p>*Low on stock. Please reduce the number of items and try again</p> :
                null}
              </h2> 
              <button type="button" onClick={() => this.handleDelete(item.id)}>Remove From Cart</button>
              </div>

              ) : null
              
            )
          })) : null
          <h3>Total: ${this.state.totalAmount}</h3>
        </div>
        <button type="button" onClick={this.updateDatabase}>CLICKKK</button>

      {(this.state.totalQuantity > 0 && this.state.itemsAllAvailable) ?
				<Checkout
          amount={this.state.totalAmount}
					onSubmit={this.submitOrder}
			  /> :
          <h1>Cart is empty or needs modifying</h1>
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
	cart: state.orders.orders
});

const mapDispatchToProps = dispatch => ({
  fillCart: () => dispatch(fillCart()),
  buyStuff: status => dispatch(buyStuff(status)), 
  deleteFromOrder: itemId => dispatch(deleteFromOrder(itemId)), 
  addToOrders: (price, locationId, userId, quantity) =>dispatch(addToOrders({price: price, locationId: locationId, userId: userId, quantity: quantity}))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShoppingCart));
