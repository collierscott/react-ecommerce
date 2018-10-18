import React from 'react';
import {GridLoader} from 'react-spinners';
import {Box} from 'gestalt';

const Loader = ({show}) => {
  return (
		show && <Box
			position="fixed"
			dangerouslySetInlineStyle={{
				__style: {
					top: 200,
					left: "50%",
					transform: "translateX(-50%)"
				}
			}}
		>
			<GridLoader color="darkorange" size={25} margin="5px"/>
		</Box>
  )
};

export default Loader;
