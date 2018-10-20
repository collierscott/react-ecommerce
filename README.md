# React eCommerce
A very simple e-commerce example using ReactJS, Strapi, MongoDB, Stripe and SendGrid. 

There are a lot of improvements that can be done (e.g. move items in cart to its own component). Also, I had never used 
[Gastalt](https://github.com/pinterest/gestalt) before so I experimented with it.

For a free development MongoDB, try [MLab](https://mlab.com/)

For a good email service, try [SendGrid](https://sendgrid.com/).

Admittedly, this documentation is lacking. Checkout [Strapi Documentation](https://strapi.io/documentation/3.x.x/) for more info.

## Installation
### Server
- In the server folder, rename ```env.example.js``` to ```env.js``` and enter your [Stripe](http:://www.stripe.com) API secret key.
- In server folder, run ```npm i``` then ```strapi start```.
- You can checkout [Strapi Documentation](https://strapi.io/documentation/3.x.x/) for more info.
- Database settings are in ```server/config/environments/development/database.json```
- Admin Control Panel - http://localhost:1337/admin
- GraphQL Playground - http://localhost:1337/graphql

### Client
- In the client/src folder, rename ```env.example.js``` to ```env.js``` and enter your [Stripe](http:://www.stripe.com) API public key.
- In client folder, run ```npm i``` then ```npm start```.
- You can checkout [Strapi Documentation](https://strapi.io/documentation/3.x.x/) for more info.


## Database
### Content Types
type: Brand
name: string
description: text
relationship: Brand belongs to many Brews

type: Brew
name: string
description: text 
price:  number:decimal
realtionship: Brand has many Brews

type: orders
address: string
postalCode: string
city: string
brews: JSON
amount: number:decimal