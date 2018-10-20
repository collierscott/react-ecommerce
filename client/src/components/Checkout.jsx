import React, {Fragment} from "react";
import {withRouter} from 'react-router-dom';
import { Container, Box, Heading, TextField, Text } from "gestalt";
import {Elements, StripeProvider, CardElement, injectStripe} from 'react-stripe-elements';
import ToastMessage from "./ToastMessage";
import {getCart, calculatePrice, clearCart, calculateAmount} from '../utils';
import ConfirmationModal from './ConfirmationModal';
import Strapi from "strapi-sdk-javascript/build/main";
import {STRIPE_KEY} from '../env';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

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

    handleSubmitOrder = async () => {
        const {cartItems, city, address, postalCode, confirmationEmailAddress} = this.state;
        const amount = calculateAmount(cartItems);
        this.setState({
            orderProcessing: true
        });
        try {
            const response = await this.props.stripe.createToken();
            const token = response.token.id;
            await strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                city,
                postalCode,
                address,
                token
            });

            await strapi.request('POST', '/email', {
                data: {
                    to: confirmationEmailAddress,
                    from: 'scott@onlinespaces.com',
                    subject: `Order Confirmation - BrewHaus ${new Date(Date.now())}`,
                    text: 'Your order has been processed.',
                    html: '<strong>Expect your order to arrive soon!</strong>'
                }
            });

            this.setState({
                modal: false,
                orderProcessing: false
            });
            clearCart();
            this.showToast('Your order has been submitted.', true);
        } catch(error) {
            this.setState({
                modal: false,
                orderProcessing: false
            });
            this.showToast('An error occurred while processing your order.', false);
        }
    };

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
        return !address || !postalCode || !city || !confirmationEmailAddress;
    };

    showToast = (toastMessage, redirect = false) => {
        this.setState({ toast: true, toastMessage });
        setTimeout(() => this.setState({ toast: false, toastMessage: "" },
            () => redirect && this.props.history.push('/')
        ), 5000);
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
                                        <Box key={item._id} padding={1}>
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
                                    maxWidth: 450,
                                    width: "100%"
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
                                        type="text"
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

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider
    apiKey={STRIPE_KEY}
  >
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
