import React, { Component } from 'react';
import {Box, Container, Heading} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import './App.css';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  async componentDidMount() {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
            brands{
            name
            image {
              name
              url
            }
            description
          }
        }`
      }
    });
  }
  render() {
    return (
      <Container>
        {/* brands */}
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
      </Container>
    );
  }
}

export default App;
