import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Heading, Text, Image, Card, Button, Mask, IconButton} from 'gestalt';
import {calculatePrice, setCart, getCart} from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {
    state = {
       brews: [],
       brand: '',
      cartItems: getCart(),
    };

    async componentDidMount() {
        //console.log(this.props.match.params.brandId);
        try {
            const {data} = await strapi.request('POST', '/graphql', {
                data: {
                    query: `
                    query {
                      brand(id: "${this.props.match.params.brandId}") {
                        name
                        brews {
                          name,
                          description,
                          image {
                            url
                          }
                          price
                        }
                      }
                    }
                    `
                }
            });
            this.setState({
                brews: data.brand.brews,
                brand: data.brand.name
            })
        } catch (e) {
            console.log(e);
        }
    }

    addToCart = brew => {
      const alreadyInCart = this.state.cartItems.findIndex(item => item.name === brew.name);

      if(alreadyInCart === -1) {
        const updatedItems = this.state.cartItems.concat({
          ...brew,
          quantity: 1
        });
        //Uses callback
        this.setState({
          cartItems: updatedItems,
        }, ()=> setCart(updatedItems));
      } else {
        const updatedItems = [...this.state.cartItems];
        updatedItems[alreadyInCart].quantity +=1;
        //Uses callback
        this.setState({
          cartItems: updatedItems
        }, ()=> setCart(updatedItems)
          );
      }
    };

  deleteItemFromCart = itemToDelete => {
    const filtered = this.state.cartItems.filter(
      item => item.name !== itemToDelete
    );
    this.setState({
      cartItems: filtered,
    }, ()=> setCart(filtered))
  };

    render() {
        const {brand, brews, cartItems} = this.state;
        return (
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                  __style: {
                    flexWrap: 'wrap-reverse'
                  }
                }}
            >
                <Box
                    display="flex"
                    direction="column"
                    alignItems="center"
                >
                    <Box margin={2}>
                        <Heading
                            color="orchid"
                        >
                            {brand}
                        </Heading>
                    </Box>
                    <Box
                        wrap
                        dangerouslySetInlineStyle={{
                            __style: {
                                backgroundColor: '#bdcdd8'
                            }
                        }}
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                    >
                        {brews && brews.map(brew => {
                            return (
                                <Box
                                    paddingY={4}
                                    key={brew.name}
                                    margin={2}
                                    width={210}>
                                    <Card
                                        image={
                                            <Box height={200} width={200}>
                                                <Image alt="Brew"
                                                       naturalHeight={1}
                                                       naturalWidth={1}
                                                       fit="cover"
                                                       src={`${apiUrl}${brew.image.url}`}/>
                                            </Box>
                                        }
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            direction="column"
                                            marginBottom={2}
                                        >
                                            <Text bold size="xl">{brew.name}</Text>
                                            <Text align="center">{brew.description}</Text>
                                            <Text
                                                align="center"
                                                color="orchid">
                                                ${brew.price}
                                                </Text>
                                            <Box
                                                marginTop={2}
                                                >
                                                <Text bold size="xl">
                                                    <Button
                                                      color="blue"
                                                      text="Add to Cart"
                                                      onClick={() => this.addToCart(brew)}
                                                    />
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
              {/* Cart */}
                <Box
                    marginTop={2}
                    marginLeft={8}
                    alignSelf="end"
                    >
                    <Mask shape="rounded" wash>
                      <Box display="flex"
                           direction="column"
                           alignItems="center"
                           padding={2}
                      >
                        <Heading align="center" size="sm">Your Cart</Heading>
                          <Text
                            color="gray"
                            italic
                          >
                            {cartItems.length} {(cartItems.length > 1 || cartItems.length === 0) ? 'items' : 'item'} selected
                          </Text>
                        {/* Cart items*/}
                        {cartItems.map(item => (
                          <Box key={item.name} display="flex" alignItems="center">
                            <Text>{item.name} x {item.quantity} - {(item.quantity * item.price).toFixed(2)}</Text>
                            <IconButton accessibilityLabel="delete item"
                                  icon="cancel"
                                  size="sm"
                                  iconColor="red"
                                        onClick={() => this.deleteItemFromCart(item.name)}
                            />
                          </Box>
                        ))}
                        <Box display="flex" alignItems="center" justifyContent="center"
                             direction="column">
                          <Box margin={2}>
                            {
                              cartItems.length === 0 &&
                              <Text color="red">Please select some items.</Text>
                            }
                          </Box>
                          <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                          <Text>
                            <Link to="/checkout">Checkout</Link>
                          </Text>
                        </Box>
                      </Box>
                    </Mask>
                </Box>
            </Box>
        )
    }
}

export default Brews;