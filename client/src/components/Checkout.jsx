import React, {Fragment} from "react";
import { Container, Box, Heading, TextField, Text } from "gestalt";
import ToastMessage from "./ToastMessage";
import {getCart, calculatePrice} from '../utils';

class Checkout extends React.Component {
    state = {
        address: "",
        postalCode: "",
        city: "",
        confirmationEmailAddress: "",
        toast: false,
        toastMessage: "",
        cartItems: []
    };

    componentDidMount() {
      this.setState({
          cartItems: getCart()
      })
    }

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value });
    };

    handleConfirmOrder = async event => {
        event.preventDefault();

        if (this.isFormEmpty(this.state)) {
            this.showToast("Fill in all fields");
            return;
        }
    };

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress;
    };

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
    };

    render() {
        const { toast, toastMessage, cartItems } = this.state;

        return (
            <Container>
                <Box
                    color="darkWash"
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                >
                  {/* Checkout Form Heading */}
                  <Heading color="midnight">Checkout</Heading>
                    {cartItems.length > 0 ?
                        <Fragment>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                marginTop={2}
                                marginBottom={6}
                            >
                                <Text color="darkGray" italic>
                                    {cartItems.length} {cartItems.length > 1 || cartItems.length === 0 ? 'items' : 'item'}
                                    {' '}in the cart.
                                </Text>
                                <Box padding={2}>
                                    {cartItems.map(item => (
                                        <Box key={item.name} padding={1}>
                                            <Text color="midnight">
                                                {item.name} x {item.quantity} - ${item.quantity * item.price}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                                <Text bold>{calculatePrice(cartItems)}</Text>
                            </Box>
                            {/* Checkout Form */}
                            <form
                                style={{
                                    display: "inlineBlock",
                                    textAlign: "center",
                                    maxWidth: 450
                                }}
                                onSubmit={this.handleConfirmOrder}
                            >
                                {/* Shipping Address Input */}
                                <Box marginBottom={2}>
                                    <TextField
                                        id="address"
                                        type="text"
                                        name="address"
                                        placeholder="Shipping Address"
                                        onChange={this.handleChange}
                                    />
                                </Box>
                                {/* Postal Code Input */}
                                <Box marginBottom={2}>
                                    <TextField
                                        id="postalCode"
                                        type="number"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        onChange={this.handleChange}
                                    />
                                </Box>
                                {/* City Input */}
                                <Box marginBottom={2}>
                                    <TextField
                                        id="city"
                                        type="text"
                                        name="city"
                                        placeholder="City of Residence"
                                        onChange={this.handleChange}
                                    />
                                </Box>
                                {/* Confirmation Email Address Input */}
                                <Box marginBottom={2}>
                                    <TextField
                                        id="confirmationEmailAddress"
                                        type="email"
                                        name="confirmationEmailAddress"
                                        placeholder="Confirmation Email Address"
                                        onChange={this.handleChange}
                                    />
                                </Box>
                                <button id="stripe__button" type="submit">
                                    Submit
                                </button>
                            </form>
                        </Fragment> :
                        <Text color="midnight">0 items in the cart.</Text>
                    }
                </Box>
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        );
    }
}

export default Checkout;
