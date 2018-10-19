import React, {Component} from 'react';
import {Container, Box, Button, Heading, Text, TextField} from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
const strapi = new Strapi('http://localhost:1337');

class Signin extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		toast: false,
		toastMessage: '',
		loading: false
	};

	handleChange = ({event, value}) => {
		event.persist();
		this.setState({
			[event.target.name]: value,
		})
	};

	handleSubmit = async event => {
		event.preventDefault();
		if(this.isFormEmpty(this.state)) {
			this.showToast('Fill in all fields');
			return;
		}
        const {username, email, password} = this.state;
		try {
			this.setState({
				loading: true
			});
			const response = await strapi.register(username, email, password);
			this.setState({
            	loading: false
        	});
			console.log(response);
			this.redirectUser('/');
		} catch(e) {
            this.setState({
                loading: false
            });
			this.showToast(e.message);
			console.log(e);
		}
	};

	redirectUser = path => this.props.history.push(path);

	showToast = toastMessage => {
		this.setState({
			toast: true,
			toastMessage
		});
		setTimeout(() => this.setState({
			toast: false,
			toastMessage: ''
		}), 5000);
	};

	isFormEmpty = ({username, email, password}) => {
		return !username || !email || !password;
	};

  render() {
  	const {toast, toastMessage} = this.state;
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

				<ToastMessage message={toastMessage} show={toast}/>
			</Container>
    );
  }
}

export default Signin;
