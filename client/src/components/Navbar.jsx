import React from 'react';
import {Box, Heading, Image, Text} from 'gestalt';
import {NavLink} from 'react-router-dom';

const Navbar = () => {
  return (
    <Box
			display="flex"
			alignItems="center"
			justifyContent="around"
			height={70}
			color="midnight"
			padding={1}
		>
			<NavLink activeClassName="active" to="/signin">
				<Text size="x1" color="white">Sign In</Text>
			</NavLink>
			<NavLink activeClassName="active" exact to="/">
				<Box display="flex" alignItems="center">
					<Box height={50} width={50} margin={2}>
						<Image alt="Brew Haus" naturalHeight={1} naturalWidth={1} src="./icons/logo.svg"/>
					</Box>
					<Heading size="xs" color="orange">Brew Haus</Heading>
				</Box>
			</NavLink>
			<NavLink activeClassName="active" to="/signout">
				<Text size="x1" color="white">Sign Out</Text>
			</NavLink>
		</Box>
  )
};

export default Navbar;
