import React from 'react';
import {Box, Heading, Image, Text, Button} from 'gestalt';
import {NavLink, withRouter} from 'react-router-dom';
import {clearToken, clearCart, getToken} from '../utils';

const Navbar = (props) => {
	const handleSignout = () => {
		clearToken();
		clearCart();
        redirectUser('/');
	};

    const redirectUser = path => props.history.push(path);

	return getToken() !== null ?
		<AuthNavbar handleSignout={handleSignout} /> :
		<UnAuthNavbar />
};

const AuthNavbar = ({handleSignout}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
        >
            <NavLink activeClassName="active" to="/checkout">
                <Text size="xl" color="white">Checkout</Text>
            </NavLink>
            <NavLink activeClassName="active" exact to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50} margin={2}>
                        <Image alt="Brew Haus" naturalHeight={1} naturalWidth={1} src="./icons/logo.svg"/>
                    </Box>
                    <Heading size="xs" color="orange">Brew Haus</Heading>
                </Box>
            </NavLink>
			<Button
				color="transparent"
				text="Sign Out"
				inline
				size="md"
				onClick={handleSignout}
				/>
        </Box>
    )
};

const UnAuthNavbar = () => {
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
				<Text size="xl" color="white">Sign In</Text>
			</NavLink>
			<NavLink activeClassName="active" exact to="/">
				<Box display="flex" alignItems="center">
					<Box height={50} width={50} margin={2}>
						<Image alt="Brew Haus" naturalHeight={1} naturalWidth={1} src="./icons/logo.svg"/>
					</Box>
					<Heading size="xs" color="orange">Brew Haus</Heading>
				</Box>
			</NavLink>
			<NavLink activeClassName="active" to="/signup">
				<Text size="xl" color="white">Sign Up</Text>
			</NavLink>
		</Box>
  )
};

export default withRouter(Navbar);
