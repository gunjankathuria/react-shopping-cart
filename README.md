
# React shopping cart with _localization_ and _multiple currencies_

Shopping cart package provides several components:
- __Cart__
- __Product__
- __CheckoutButton__

which can be used separately or in union.
By default [__Redux__](https://github.com/reactjs/redux) is the framework to operate data.

So, it's your choice to use Redux or not, but its reducers, actions and actionTypes are already included.

Pay attention! All components are  [__Pure__](https://facebook.github.io/react/docs/react-api.html#react.purecomponent).

**Meta**

-   **author**: Oleg Nosov &lt;olegnosov1@gmail.com>
-   **license**: MIT

## Demo

Production demo: [`https://www.solarleague.org/shop/macbook-case/`](https://www.solarleague.org/shop/macbook-case/)

[`Latest version demo (example1)`](https://olegnn.github.io/)

**Usage**
```shell
npm i --save react-shopping-cart
```

**Examples**


In all cases you must include bootstrap_v4.css in your project
```javascript
import 'bootstrap/dist/css/bootstrap.css';
```
And if you want to see animation, also include animate.css
```javascript
import 'animate.css/animate.min.css';
```

__With Redux.__ After store initialization you must dispatch setCartCurrency action or 'USD' will be used as cart's currency.
```javascript
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import {
  Cart,
  Product,
  CheckoutButton,
  cartLocalization,
  cartReducer,
  setCartCurrency,
} from 'react-shopping-cart';


import 'bootstrap/dist/css/bootstrap.css';
import 'animate.css/animate.min.css';

const { getDefaultLocalization } = cartLocalization;

// You may take localization object from wherever you want, that's just an example
// For more information, see localization section
const iPadCaseLocalization = {
  colour: 'Colour',
  iPadCase: 'iPad case',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  GBP: '£',
  EUR: '€',
  USD: '$',
};

const iPadPropertiesWithAdditionalCostLocalization = {
  yellow: 'Yellow (+{cost}{localizedCurrency})',
};

const store = createStore(
  combineReducers(
    {
      cart: cartReducer,
      // Your own reducers, sir
    }
  )
);

store.dispatch(
  setCartCurrency('USD'),
);


class App extends Component {

  state = {
    product: {
      name: 'iPadCase',
      id: 'ipad-case',
      path: '/shop/ipad-case/',
      properties: {
        colour: ['red', 'green', {
          additionalCost: {
            GBP: 1,
            EUR: 2,
            USD: 3.50,
          },
          value: 'yellow',
        }],
      },
      propertiesToShowInCart: ['colour'],
      prices: { GBP: 70, EUR: 80, USD: 90 },
      currency: 'GBP',
      imagePath: '1-483x321.jpeg',
    },
    getProductLocalization:
      getDefaultLocalization(
        'product',
        'en',
        {
          ...iPadCaseLocalization,
          ...iPadPropertiesWithAdditionalCostLocalization
        }
      ),
    getCheckoutButtonLocalization:
      getDefaultLocalization(
        'checkoutButton',
        'en',
        iPadCaseLocalization,
      ),
    getCartLocalization:
      getDefaultLocalization(
        'cart',
        'en',
        iPadCaseLocalization
      )
  };

  render() {

    const {
      product,
      getCheckoutButtonLocalization,
      getProductLocalization,
      getCartLocalization,
    } = this.state;

    const checkoutButtonElement =
      <CheckoutButton
        getLocalization={
          getCheckoutButtonLocalization
        }
        checkoutURL="/to/my/checkout"
      />;
    return (
      <Provider store={store}>
        <div className="container">
          <Product
            {...product}
            checkoutButton={checkoutButtonElement}
            getLocalization={
              getProductLocalization
            }

          />
          <Cart
            checkoutButton={checkoutButtonElement}
            getLocalization={
              getCartLocalization
            }
          />
        </div>
      </Provider>
    );
  }
}

export default App;


// You also may import actions and actionTypes

import { cartActions, cartActionTypes } from 'react-shopping-cart';

// And do some cool things with them
```

__Without redux__
```javascript
import React, { Component } from 'react';
import {
  CartComponent,
  ProductComponent,
  CheckoutButtonComponent,
  cartLocalization,
} from 'react-shopping-cart';


import 'bootstrap/dist/css/bootstrap.css';
import 'animate.css/animate.min.css';

const { getDefaultLocalization } = cartLocalization;

// You may take localization object from wherever you want, that's just an example
// For more information, see localization section
const iPadCaseLocalization = {
  colour: 'Colour',
  iPadCase: 'iPad case',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  GBP: '£',
  EUR: '€',
  USD: '$',
};

const iPadPropertiesWithAdditionalCostLocalization = {
  yellow: 'Yellow (+{cost}{localizedCurrency})',
};

class App extends Component {

  state = {
    products: {},
    product: {
      name: 'iPadCase',
      id: 'ipad-case',
      path: '/shop/ipad-case/',
      properties: {
        colour: ['red', 'green', {
          additionalCost: {
            GBP: 1,
            EUR: 2,
            USD: 3.50,
          },
          value: 'yellow',
        }],
      },
      propertiesToShowInCart: ['colour'],
      prices: { GBP: 70, EUR: 80, USD: 90 },
      currency: 'GBP',
      imagePath: '1-483x321.jpeg',
    },
    getProductLocalization:
      getDefaultLocalization(
        'product',
        'en',
        {
          ...iPadCaseLocalization,
          ...iPadPropertiesWithAdditionalCostLocalization
        }
      ),
    getCheckoutButtonLocalization:
      getDefaultLocalization(
        'checkoutButton',
        'en',
        iPadCaseLocalization,
      ),
    getCartLocalization:
      getDefaultLocalization(
        'cart',
        'en',
        iPadCaseLocalization
      )
  };

  addProduct = (key, product, currency) =>
    void this.setState(
      (
        {
          products:
            {
              [key]: cartProduct = { quantity: 0 },
              ...restOfProducts
            }
        }
      ) => ({
        products: {
          ...restOfProducts,
          [key]: {
            ...product,
            quantity:
              product.quantity +
              cartProduct.quantity,
          }
        }
      })
    );

  generateProductKey = (id, properties) =>
    `${id}/${Object.entries(properties).join('_')}`;

  updateProduct = (key, updatedProduct) => void console.log(':)');

  removeProduct = key => void console.log(':C');

  render() {

    const {
      addProduct,
      generateProductKey,
      updateProduct,
      removeProduct,
      state,
    } = this;

    const {
      getProductLocalization,
      getCheckoutButtonLocalization,
      getCartLocalization,
      products,
      product,
    } = state;

    const checkoutButtonElement =
      <CheckoutButtonComponent
        grandTotal={500}
        hidden={false}
        checkoutURL="/to/my/checkout"
        currency="GBP"
        getLocalization={getCheckoutButtonLocalization}
      />;
    return (
      <div className="container">
        <ProductComponent
          {...product}
          checkoutButton={checkoutButtonElement}
          onAddProduct={
            addProduct
            // Help product to get into the cart
          }
          generateProductKey={
            generateProductKey
                    // create product key as you wish
          }
          getLocalization={getProductLocalization}
        />


        <CartComponent
          products={
            products
            // Provide your own product's Object(Look at ProductsMapType)
          }
          onUpdateProduct={
            updatedProduct
            // Update something
          }
          getLocalization={
            getCartLocalization
          }
          currency="GBP"
          onRemoveProduct={
            removeProduct
            // Remove something
          }
          checkoutButton={
            checkoutButtonElement
          }
          isCartEmpty={
            false
          }
          getLocalization={getCartLocalization}
        />
      </div>
    );
  }
}

export default App;
```

## Localization

The default localization library is [intl-messageformat](https://github.com/yahoo/intl-messageformat).
In order to localize your cart, you can chose one of the possible ways:
- Create your own __getLocalization__ func and pass it as props to the cart's components
- Create getLocalization function with bound localization using __defaultLocalization__ object and __getLocalization__,  __getDefaultLocalization__ functions from _cartLocalization_ module, pass it as props to the cart's components
- Don't do anything and see only default language in your cart :C

Because all components are pure, in order to relocalize your components, you should pass __new getLocalization function__, not old with just new scope.
The first one should be look like that if you're also using intl-messageformat

```javascript
  import React from 'react';
  import IntlMessageFormat from 'intl-messageformat';
  import { Cart } from 'react-shopping-cart';


  const localization = {
    en: {
      cart : {
        GBP: '£',
      },
    },
  };

  const getLocalization = (localization, language, id, params = {}) =>  
    new IntlMessageFormat(localization[id], language).format(params);

  <Cart
    getLocalization={(...args) => getLocalization(localization.en.cart, 'en', ...args)}
  />
```
Or you could use __getDefaultLocalization__ func from _cartLocalization_:
```javascript
  import React from 'react';
  import { Cart, cartLocalization } from 'react-shopping-cart';

  const { getDefaultLocalization } = cartLocalization;

  const localization = {
    GBP: '£',
    USD: '$',
  };

  <Cart
    getLocalization={getDefaultLocalization('cart', 'en', localization)}
  />
```
Example usage of __getLocalization__ func from _cartLocalization_:
```javascript
  import React from 'react';
  import { Cart, cartLocalization } from 'react-shopping-cart';

  const { getLocalization, defaultLocalization } = cartLocalization;

  const localization = {
    en: {
      cart : {
        GBP: '£',
      },
    },
  };

  const mergedEnCartLocalization = {
    ...localization.en.cart,
    ...defaultLocalization.en.cart,
  };

  <Cart
    getLocalization={(...args) => getLocalization(mergedEnCartLocalization, 'en', ...args)}
  />
```
Generally, getLocalization is just a function which accepts id and params(optional) and returns string,
based on received arguments.
For built-in getLocalization func you may write your translation for default statements as a string or object in format { component : Function | string, text : string, props? : object }

__Localization__ default ids and params bindings:
- __cart:__
  - _no params_
    - shoppingCartTitle

  - _{
      quantity,
      price,
      total,
      currency,
      name,
      localizedName,
      localizedCurrency,
    }_
    - productName
    - quantityLabel
    - priceLabel
    - priceValue
    - totalLabel
    - totalValue
    - remove
    - ___your currency___
    - ___your product's name___

  - _{name, value, localizedName, localizedValue,}_
    - productPropertyLabel
    - productPropertyValue
    - ___your product's property name___
    - ___your product's property value (if string ofc)___

- __checkoutButton__
  - _{currency, total, localizedCurrency,}_
    - checkoutTotal
    - ___your currency___

- __product__
  - _{
      name,
      quantity,
      price,
      currency,
      localizedName,
      localizedCurrency,
    }_
    - price
    - quantityLabel
    - propertyLabel
    - addToCart
    - ___your product's name___
    - ___your product's currency___
  - _{
      name,
      currency,
      localizedName,
      localizedCurrency,
    }_
    - ___your product's name___
    - ___your product's property name___
    - _{(optional) cost}_
      - ___your product's property value (if string ofc)___

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

# Cart

**Extends React.PureComponent**

Component which represents shopping cart.

**Meta**

-   **author**: Oleg Nosov &lt;olegnosov1@gmail.com>
-   **license**: MIT

## propTypes

**Properties**

-   `showHeader` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Show or hide header 'Shopping cart'.
    Default is true
-   `iconTrashClassName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ClassName for
    trash icon on remove button.
    Default is 'icon-trash'
-   `cartTransition` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Cart's config for Transition.
    Default is
     {
       style: animate(500),
       enteringClassName: 'fadeInUp',
       exitingClassName: 'fadeOut',
       exitedClassName: 'invisible',
       timeout: 500,
     }.
    Look at src/components/Cart/Cart.js for details.
-   `cartItemTransition` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Cart item's config
    for ReactCSSTransitionGroup.
    Default is
      {
        transitionName: {
          enter: 'bounceInLeft',
          leave: 'bounceOutRight',
        },
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500,
      }.
    Look at src/components/Cart/Cart.js for details.
-   `linkComponent` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** React Component(stateful or not,
    as you wish), which represents a Link. It will receive props:
    to="%your product's page%".
    I'd recommend you to take a look at react-router's Link.
    Wrapped <a/> by default.

## containerPropTypes

**Properties**

-   `products` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), ProductType>** Products map. Required.
-   `currency` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Current currency. Required.
-   `isCartEmpty` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Display cart or not. Required.
-   `checkoutButton` **ReactElement** Button in the bottom of cart.
    Required.
-   `onUpdateProduct` **[onUpdateProductType](#onupdateproducttype)** Callback
    function which will be called when product should be updated.
    First arg is product's key in products, second - props to update.
    For instance, it may be called like:
    onUpdateProduct('macbook-case/\_red', { quantity : 50 });
    Required.
-   `onRemoveProduct` **[onRemoveProductType](#onremoveproducttype)** Callback to call
    when need to remove product from products.
    Accept product's key in products.
    For example: onRemoveProduct('/shop/macbook-case/\_red');
    Required.
-   `getLocalization` **[getLocalizationType](#getlocalizationtype)** Required.

# Product

**Extends React.PureComponent**

React component - Product form with price.

**Meta**

-   **author**: Oleg Nosov &lt;olegnosov1@gmail.com>
-   **license**: MIT

## propTypes

**Properties**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name to display. Required.
-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Product's id. Required.
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Path to product. Required.
-   `prices` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Prices (currency-value). Required.
-   `imagePath` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Path to main image. Required.
-   `currency` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Price currency. Required.
-   `properties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([ProductPropertyOptionType](#productpropertyoptiontype))>>** Custom product properties. May be array of number, string or
    shape({ additionalCost(optional), onSelect(optional), value(required)})
    Default is {}.
-   `propertiesToShowInCart` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Array of propery names to
    display in cart. Default is \[].
-   `scrollAnimationConfig` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Config for animateScroll
    (from react-scroll) scrollTo function.
    Default is
     {
       duration: 750,
       delay: 0,
       smooth: true,
     }.
-   `iconAddProductClassName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ClassName for cart icon
    on add to button.
    Default is 'icon-cart-plus'.
-   `afterPriceNode` **ReactNode** Node to display after price element.
    Optional.
-   `descriptionNode` **ReactNode** Node to display before price element.
    Optional.

## containerPropTypes

**Properties**

-   `CheckoutButton` **ReactElement** Button in the bottom of product.
    Required.
-   `onAddProduct` **[onAddProductType](#onaddproducttype)** Callback to call when
    user wants to add product in his cart.
    Example:
    onAddProduct(
      'macbook-case',
      {
        quantity: 30,
        properties: { colour: 'red' },
        productInfo: {
          prices: {
           GBP: 70
          },
         ...etc
        },
      },
      'GBP'
    );
    Required.
-   `getLocalization` **[getLocalizationType](#getlocalizationtype)** Required.
-   `generateProductKey` **[generateProductKeyType](#generateproductkeytype)** Function which generates
    product's key based on id and properties. Example:
    generateProductKey('macbook-case', { colour: 'red' } ).

# CheckoutButton

**Extends React.PureComponent**

Checkout button with grand total.

**Meta**

-   **author**: Oleg Nosov &lt;olegnosov1@gmail.com>
-   **license**: MIT

## propTypes

**Properties**

-   `checkoutURL` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Link to checkout page.
    Required.
-   `iconCheckoutClassName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ClassName
    for cart icon on checkout button.
    Default is 'icon-basket'.
-   `transitionConfig` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** CheckoutButton's transition config
    for react-overlays Transition.
    Default is {
      style: animate(500),
      enteringClassName: 'fadeInUp',
      exitingClassName: 'fadeOut',
      timeout: 500,
      unmountOnExit: true,
    }.
-   `linkComponent` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** React Component(stateful or not,
    as you wish), which represents a Link. It will receive props:
    role="button",
    to="%your checkout%",
    className-"%bs4's className for button%".
    I'd recommend you to take a look at react-router's Link.
    Wrapped <a/> by default.

## containerPropTypes

**Properties**

-   `grandTotal` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Amount of money to pay. Required.
-   `hidden` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Show or hide button. Required.
-   `currency` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Current cart currency. Required.
-   `getLocalization` **[getLocalizationType](#getlocalizationtype)** Required.

# Types

Redux cart data types file

**Meta**

-   **author**: Oleg Nosov &lt;olegnosov1@gmail.com>
-   **license**: MIT

## PricesType

Pair (currency: price)

**Properties**

-   `currency` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Pair (currency: price)

## ProductInfoType

**Properties**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Display name
-   `prices` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Object contains { [currency]&#x3A; price } pairs
-   `imagePath` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Path to main image
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Link to product's page
-   `propertiesToShowInCart` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>?** Array
    of names of properties which need to be shown in cart

## ProductType

**Properties**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `quantity` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `properties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), ([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))>** Custom product properties.
    In order to make prop visible in cart, add its name
    to productPropsToShow array
-   `productInfo` **ProductInfoType** 

**Examples**

```javascript
{
   id: 'macbook-case',
   quantity: 3,
   properties: {
     colour: 'red'
   },
   productInfo: {
     name: 'Macbook case',
     prices: {
      GBP: 50
     },
     path: '/shop/macbook-case/',
     imagePath: '/shop/macbook-case/1-483x321.jpeg',
     propertiesToShowInCart: ['colour']
   }
 }
```

## ProductsMapType

Pair (productKey: product)

## CartType

**Properties**

-   `total` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Grand total
-   `summary` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Readable stringified cart
-   `products` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), ProductType>** Products map

# generateProductKeyType

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Product's id.
-   `properties` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Product's properties

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# onAddProductType

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Product's key.
-   `product` **ProductType** Product to add
-   `currency` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Current product's currency.

# onUpdateProductType

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Product's key.
-   `updatedProduct` **PorductType** 

# onRemoveProductType

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Product's key.

# getLocalizationType

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Template id.
-   `params` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Params. (optional, default `{}`)

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ReactElement)** 

# ProductPropertyOptionType

Also may be string or number, as Object used only in Product component for now

**Properties**

-   `additionalCost` **PricesType?** 
-   `onSelect` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)?** 
-   `value` **([number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** 


##Development

**Developer mode**

Run [webpack-dev-server](https://github.com/webpack/webpack-dev-server) for example1
```shell
npm run develop
```

**Build**

```shell
npm run build
```
And then check dist folder

**Build Example**

```shell
npm run build_example
```
And then check examples folder


**Testing**

[Jest](https://github.com/facebook/jest) is used for tests
```shell
npm run test
```

**Linter**

[ESLint](https://github.com/eslint/eslint) is used as linter
```shell
npm run lint
```

**Flow Type**

Check types in project using [Flow](https://github.com/facebook/flow)
```shell
npm run flow
```

**Autodoc**

Generate doc using [documentation js](https://github.com/documentationjs/documentation)
```shell
npm run doc
```
And then look at README.md
