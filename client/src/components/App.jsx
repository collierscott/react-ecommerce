import React, { Component } from 'react';
import {Box, Card, Container, Heading, Image, Text} from 'gestalt';
import {Link} from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import './App.css';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands: []
  };

  async componentDidMount() {

    try {
      const {data} = await strapi.request('POST', '/graphql', {
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
      this.setState({brands: data.brands});
    } catch(err) {
      console.log(err)
    }
  }
  render() {
    const {brands} = this.state;
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
        <Box
          display="flex"
          justifyContent="around"
        >
        {brands && brands.map(brand => {
          return (
            <Box key={brand.name} margin={2} width={200}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image alt="Brand"
                           naturalHeight={1}
                           naturalWidth={1}
                           src={`${apiUrl}${brand.image.url}`}/>
                  </Box>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text bold size="xl">{brand.name}</Text>
                  <Text align="center">{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand.name}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          )
        })}
        </Box>
      </Container>
    );
  }
}

export default App;
