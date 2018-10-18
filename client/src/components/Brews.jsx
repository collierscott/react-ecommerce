import React, {Component} from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Heading, Text, Image, Card, Button} from 'gestalt';
import {Link} from "react-router-dom";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {
    state = {
       brews: [],
       brand: ''
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

    render() {
        const {brand, brews} = this.state;
        return (
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
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
                                                    <Button color="blue" text="Add to Cart" />
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default Brews;