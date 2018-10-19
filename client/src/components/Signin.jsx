import React, {Component} from 'react';
import {Container, Box, Button, Heading, Text, TextField} from 'gestalt';

class Signin extends Component {
	state = {
		username: '',
		email: '',
		password: ''
	};

	handleChange = ({event, value}) => {
		event.persist();
		this.setState({
			[event.target.name]: value,
		})
	};

	handleSubmit = event => {
		event.preventDefault();
		if(!this.isFormEmpty(this.state)) {
			console.log('submitted');
		}
	};

	isFormEmpty = ({username, email, password}) => {
		return !username || !email || !password;
	};

  render() {
    return (
      <Container>
				<Box
					dangerouslySetInlineStyle={{
						__style: {
							backgroundColor: '#ebe2da'
						}
					}}
					margin={4}
					padding={4}
					shape="rounded"
					display="flex"
					justifyContent="center"
				>
					<form style={{
						display: 'inlineBlock',
						textAlign: 'center',
						maxWidth: 450
					}}
						onSubmit={this.handleSubmit}
					>
						<Box
							marginBottom={2}
							display="flex"
							direction="column"
							alignItems="center"
						>
							<Heading color="midnight">Let's get started</Heading>
							<Text color="orchid">Sign up to order some brews</Text>
						</Box>
						<Box marginBottom={2}>
							<TextField
								id="username"
								name="username"
								type="text"
								placeholder="Username"
								onChange={this.handleChange}
							/>
						</Box>
						<Box marginBottom={2}>
							<TextField
								id="email"
								name="email"
								type="email"
								placeholder="Email"
								onChange={this.handleChange}
							/>
						</Box>
						<Box marginBottom={2}>
							<TextField
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								onChange={this.handleChange}
							/>
						</Box>
							<Button inline text="Submit" color="blue" type="submit"/>
					</form>
				</Box>
			</Container>
    );
  }
}

export default Signin;
