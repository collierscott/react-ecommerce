import React from 'react';
import {Box, Button, Modal, Spinner, Text} from 'gestalt';
import {calculatePrice} from "../utils";

const ConfirmationModal = ({
    orderProcessing, cartItems, handleSubmitOrder, closeModal
   }) => {
    return (
        <Modal
            onDismiss={closeModal}
            accessibilityCloseLabel="close"
            accessibilityModalLabel="Confirm Your Order"
            heading="Confirm Your Order"
            footer={
                <Box
                    display="flex"
                    marginRight={-1}
                    justifyContent="center"
                    >
                    <Box padding={1}>
                        <Button
                            text="Submit"
                            color="red"
                            size="lg"
                            disabled={orderProcessing}
                            onClick={handleSubmitOrder}
                        />
                    </Box>
                    <Box padding={1}>
                        <Button
                            text="Cancel"
                            size="lg"
                            disabled={orderProcessing}
                            onClick={closeModal}
                        />
                    </Box>
                </Box>
            }
            role="alertdialog"
            size="sm"
        >
            {!orderProcessing && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    padding={2}
                    color={"lightWash"}
                >
                    {cartItems.map(item => (
                        <Box key={item._id} padding={1}>
                            <Text color="midnight">
                                {item.name} x {item.quantity} - ${item.quantity * item.price}
                            </Text>
                        </Box>
                    ))}
                    <Box paddingY={2}>
                        <Text size="lg" bold>
                            Total: {calculatePrice(cartItems)}
                        </Text>
                    </Box>
                </Box>
            )}
            <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
            {orderProcessing && <Text align="center" italic>Submitting Order</Text>}
        </Modal>
    )
};

export default ConfirmationModal;
