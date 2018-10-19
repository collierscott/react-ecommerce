import React from 'react';
import {Toast, Box} from 'gestalt';

const ToastMessage = ({show, message}) => {
  return (
    show && (
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            top: 200,
            left: "50%",
            transform: "translateX(50%)"
          }
        }}
      >
        <Toast text={message} color="orange" />
      </Box>
    )
  )
};

export default ToastMessage;