/**
 * @flow
 * @module Cart
 * @extends React.PureComponent
 *
 * @author Oleg Nosov <olegnosov1@gmail.com>
 * @license MIT
 *
 * @description
 * Component which represents shopping cart.
 */
import React, { PureComponent, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Transition from 'react-overlays/lib/Transition';

import CartProduct from './CartProduct/CartProduct';
import { animate, DefaultLinkComponent } from '../../helpers';

const
  /**
   * @static propTypes
   * @memberof Cart
   *
   * @prop {boolean} showHeader - Show or hide header 'Shopping cart'.
   * Default is true
   * @prop {string} iconTrashClassName - ClassName for
   * trash icon on remove button.
   * Default is 'icon-trash'
   * @prop {Object} cartTransition - Cart's config for Transition.
   * Default is
   *  {
   *    style: animate(500),
   *    enteringClassName: 'fadeInUp',
   *    exitingClassName: 'fadeOut',
   *    exitedClassName: 'invisible',
   *    timeout: 500,
   *  }.
   * Look at src/components/Cart/Cart.js for details.
   * @prop {Object} cartItemTransition - Cart item's config
   * for ReactCSSTransitionGroup.
   * Default is
   *   {
   *     transitionName: {
   *       enter: 'bounceInLeft',
   *       leave: 'bounceOutRight',
   *     },
   *     transitionEnterTimeout: 500,
   *     transitionLeaveTimeout: 500,
   *   }.
   * Look at src/components/Cart/Cart.js for details.
   * @prop {Function} linkComponent - React Component(stateful or not,
   * as you wish), which represents a Link. It will receive props:
   * to="%your product's page%".
   * I'd recommend you to take a look at react-router's Link.
   * Wrapped <a/> by default.
   *
   */
  propTypes = {
    showHeader: PropTypes.bool,
    iconTrashClassName: PropTypes.string,
    cartTransition: PropTypes.object,
    cartItemTransition: PropTypes.object,
    linkComponent: PropTypes.func,
  },
  /**
   * @static containerPropTypes
   * @memberof Cart
   *
   * @prop {Object.<string, ProductType>} products - Products map. Required.
   * @prop {string} currency - Current currency. Required.
   * @prop {boolean} isCartEmpty - Display cart or not. Required.
   * @prop {ReactElement} checkoutButton - Button in the bottom of cart.
   * Required.
   * @prop {onUpdateProductType} onUpdateProduct - Callback
   * function which will be called when product should be updated.
   * First arg is product's key in products, second - props to update.
   * For instance, it may be called like:
   * onUpdateProduct('macbook-case/_red', { quantity : 50 });
   * Required.
   *
   * @prop {onRemoveProductType} onRemoveProduct - Callback to call
   * when need to remove product from products.
   * Accept product's key in products.
   * For example: onRemoveProduct('/shop/macbook-case/_red');
   * Required.
   *
   * @prop {getLocalizationType} getLocalization - Required.
   */
  containerPropTypes = {
    products: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      properties: PropTypes.object,
      productInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        prices: PropTypes.objectOf(
          PropTypes.number,
        ).isRequired,
        imagePath: PropTypes.string.isRequired,
        propertiesToShowInCart: PropTypes.arrayOf(
          PropTypes.string,
        ),
      }).isRequired,
    })).isRequired,
    currency: PropTypes.string.isRequired,
    isCartEmpty: PropTypes.bool.isRequired,
    checkoutButton: PropTypes.element.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    getLocalization: PropTypes.func.isRequired,
  },
  defaultProps = {
    showHeader: true,
    iconTrashClassName: 'icon-trash',
    cartTransition: {
      style: animate(500),
      enteringClassName: 'fadeInUp',
      exitingClassName: 'fadeOut',
      exitedClassName: 'invisible',
      timeout: 500,
    },
    cartItemTransition: {
      transitionName: {
        enter: 'bounceInLeft',
        leave: 'bounceOutRight',
      },
      transitionEnterTimeout: 500,
      transitionLeaveTimeout: 500,
    },
    linkComponent: DefaultLinkComponent,
  };


export default class Cart extends PureComponent {

  static propTypes = { ...propTypes, ...containerPropTypes };
  static defaultProps = defaultProps;

  render() {
    const {
      showHeader,
      products,
      isCartEmpty,
      iconTrashClassName,
      currency,
      cartTransition,
      cartItemTransition,
      onUpdateProduct,
      onRemoveProduct,
      getLocalization,
      checkoutButton,
    } = this.props;

    return (
      <div className="row mt-1">
        <Transition
          in={!isCartEmpty}
          {...cartTransition}
        >
          <div className="col-12">
            { showHeader ? getLocalization('shoppingCartTitle') : null }
            <div className="list-group">
              <ReactCSSTransitionGroup
                {...cartItemTransition}
              >
                {
                  Object
                    .entries(products)
                    .map((
                      [productKey,
                        {
                          productInfo: {
                            prices,
                            path,
                            name,
                            imagePath,
                            propertiesToShowInCart,
                          },
                          quantity,
                          properties,
                        },
                      ],
                    ) => (
                      <CartProduct
                        product={products[productKey]}
                        key={productKey}
                        productKey={productKey}
                        quantity={quantity}
                        properties={properties}
                        price={prices[currency]}
                        currency={currency}
                        path={path}
                        name={name}
                        imagePath={imagePath}
                        propertiesToShow={propertiesToShowInCart}
                        iconTrashClassName={iconTrashClassName}
                        onUpdateProduct={onUpdateProduct}
                        onRemoveProduct={onRemoveProduct}
                        getLocalization={getLocalization}
                        linkComponent={DefaultLinkComponent}
                      />
                    ),
                  )
                }
              </ReactCSSTransitionGroup>
            </div>
            <div className="row mt-1">
              <div
                className={
                  'col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-6' +
                  'offset-xs-0 offset-sm-0 offset-md-2 offset-lg-3 offset-xl-3'
                }
              >
                { checkoutButton }
              </div>
            </div>
          </div>
        </Transition>
      </div>
    );
  }
}
