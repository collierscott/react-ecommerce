import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Card, Container, Heading,
  Icon, Image, SearchField, Text} from 'gestalt';
import Loader from './Loader';
import './App.css';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
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
      this.setState({
        brands: data.brands,
        loadingBrands: false
      });
    } catch(err) {
      console.log(err);
      this.setState({
        loadingBrands: false
      });
    }
  }

  handleChange = ({value}) => {
    this.setState({
      searchTerm: value
    })
  };

  filteredBrands = ({searchTerm, brands}) => {
    if(searchTerm) {
      return brands.filter(brand => {
        return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      return brands;
    }
  };

  render() {
    const {searchTerm, loadingBrands} = this.state;
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          marginTop={4}
        >
          <SearchField
            accessibilityLabel="Search Brands"
            id="search"
            onChange={this.handleChange}
            placeholder="Search brands"
            value={searchTerm}
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>
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
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
        {this.filteredBrands(this.state).map(brand => {
          return (
            <Box
              paddingY={4}
              key={brand.name}
              margin={2}
              width={200}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image alt="Brand"
                           naturalHeight={1}
                           naturalWidth={1}
                           fit="cover"
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
        {/*<Spinner show={loadingBrands} accessibilityLabel="Loading Spinner"/>*/}
         <Loader show={loadingBrands}/>
      </Container>
    );
  }
}

export default App;
