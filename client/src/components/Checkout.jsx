import React, {Fragment} from "react";
import { Container, Box, Heading, TextField, Text } from "gestalt";
import {Elements, StripeProvider, CardElement, injectStripe} from 'react-stripe-elements';
import ToastMessage from "./ToastMessage";
import {getCart, calculatePrice} from '../utils';
import ConfirmationModal from './ConfirmationModal';
const config = require('../.env');

class _CheckoutForm extends React.Component {
    state = {
        address: "",
        postalCode: "",
        city: "",
        confirmationEmailAddress: "",
        toast: false,
        toastMessage: "",
        cartItems: [],
        modal: false,
        orderProcessing: false
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

        this.setState({
            modal: true
        });
    };

    handleSubmitOrder = () => {
        this.setState({
            modal: false
        });
    };

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress;
    };

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
    };

    closeModal = () => this.setState({
        modal: false
    });

    render() {
        const {toast, toastMessage, cartItems, modal, orderProcessing} = this.state;

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
                                <CardElement
                                  id="stripe__input"
                                  onReady={input => input.focus()}
                                />
                                <button id="stripe__button" type="submit">
                                    Submit
                                </button>
                            </form>
                        </Fragment> :
                        <Text color="midnight">0 items in the cart.</Text>
                    }
                </Box>
                {modal && <ConfirmationModal
                  orderProcessing={orderProcessing}
                  cartItems={cartItems}
                  closeModal={this.closeModal}
                  handleSubmitOrder={this.handleSubmitOrder}
                />}
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        );
    }
}

const CheckoutForm = injectStripe(_CheckoutForm);

const Checkout = () => (
  <StripeProvider
    apiKey="`${config.STRIPE_KEY}`"
  >
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
)

export default Checkout;
