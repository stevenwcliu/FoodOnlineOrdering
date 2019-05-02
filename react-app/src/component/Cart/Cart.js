import React, {Component} from 'react';
import "./Cart.css"
import {Link} from "react-router-dom";
import logo from "../images/ezgif-1-e382b6df9dbb.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import userService from "../../common/services/User/UserService";
import UserStoreService from "../../common/services/User/UserStoreService";
import Login from "../Authentication/Login/Login";
import Modal from "@material-ui/core/Modal/Modal";

class Cart extends Component {

    state = {

        userStatus: UserStoreService.isLoggedin()? 'Order History': 'Login',
        open: false,
        itemList: [],
        quantity: 1,
        totalPrice: 0,

    };

componentDidMount() {

    if(UserStoreService.getToken() !== undefined) {
        userService.user_shoppingcart().then((data) => {

            console.log(data, "data");
            this.setState({itemList: data})
        }).catch((error) => {
            // alert(error.message);
        });

        userService.user_shoppingcarttotal().then((data) => {

            console.log(data, "data");
            this.setState({totalPrice: data.total.toFixed(2)})
            UserStoreService.setTotalPrice(data.total.toFixed(2))
        }).catch((error) => {
            this.setState({totalPrice: 0})
        });

    }
}



    handleOpen = () => {
        if (this.state.userStatus === 'Login') {
            this.setState({open: true});
        } else {
            this.props.history.push('/userprofile')
        }

    };

    handleClose = (login = false) => {
        let userStatus = 'Login';
        if (login) {
            userStatus = 'Order History';
        }
        this.setState({
            userStatus,
            open: false
        });
    };

    handleRemoveRow = (idx,id) => {

        let r = this.state.itemList[idx];
        let body = {
            item_id: id
        };
        userService.shoppingcart_deleteitem(JSON.stringify(body)).then((data) => {


            console.log(data, "data");
            alert("Delete item Succeed")
        }).catch((error) => {
            alert(error.message);
        });

        this.setState({
            itemList: this.state.itemList.filter(function (row) {

                return row !== r;

            }),
        });


    };

    render() {
        return (
            <div>
                <img  width="300" height="200" className="rounded mx-auto d-block logo" src={logo}/>
                <Navbar align="right" bg="white" variant="light">
                    <Nav className="float-right">

                        <ul>
                            <li><a onClick={() => this.props.history.push('/')}>Home</a></li>
                            <li><a onClick={this.handleOpen}>{this.state.userStatus}</a></li>
                            <li><a onClick={() => this.props.history.push('/cart')}>Shopping Cart</a></li>
                            <li><a onClick={() => this.props.history.push('/about')}>About Us</a></li>

                        </ul>
                    </Nav>
                </Navbar>
                <Modal
                    aria-labelledby="sm snoimple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={() => this.handleClose(false)}
                >
                    <Login closeModal={this.handleClose} parentData={this.props}/>
                </Modal>
                <div className="container">

                    <div className="row">
                        <div className="col-xs-8">
                            <div className="panel panel-info">
                                <div className="panel-heading">
                                    <div className="panel-title">
                                        <div className="row padButtom">
                                            <div className="col-xs-6">
                                                <h5><span className="glyphicon glyphicon-shopping-cart"/> Shopping
                                                    Cart</h5>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    {this.state.itemList.map((item, idx) => (
                                    <div className="row">
                                        <div className="col-xs-2"><img className="img-responsive img"
                                                                       src="https://www.mcdonalds.com/content/dam/usa/documents/fresh-beef/smokehouse-double.jpg"/>
                                        </div>
                                        <div className="col-xs-4 col-md-6 pad2">
                                            <h4 className="product-name"><strong>{item.name}</strong></h4>
                                            <h4>
                                                <small>Cal: </small>
                                            </h4>
                                        </div>
                                        <div className="col-xs-6 col-md-4 pad0">
                                            <div className="col-xs-6 text-right">
                                                <h6><strong>{item.price} <span className="text-muted">x</span></strong></h6>
                                            </div>
                                            <div className="col-xs-4 pad">
                                                <button className="btn inline-block"><i className="glyphicon glyphicon-plus" /></button>
                                                <button className="btn inline-block"><i className="glyphicon glyphicon-minus" /></button>
                                                <input type="text" className="form-control input-sm inline-block" defaultValue={this.state.quantity}/>
                                            </div>
                                            <div className="col-xs-2 text-right">
                                                <button type="button" className="btn btn-link btn-xs" onClick={() => this.handleRemoveRow(idx,item.item_id)}>
                                                    <span className="glyphicon glyphicon-trash"> </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                <div className="panel-footer">
                                    <div className="row text-center">
                                        <div className="col-xs-9">
                                            <h4 className="text-right">Total <strong>${this.state.totalPrice}</strong></h4>
                                        </div>
                                        <div className="col-xs-3 pad1">
                                            <Link to="/checkout">
                                                <button type="button" className="btn btn-success btn-block">
                                                    Checkout
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;