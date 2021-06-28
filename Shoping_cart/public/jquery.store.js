displayCart: function() {
      if (this.$formCart.length) {
        var cart = this._toJSONObject(this.storage.getItem(this.cartName));
        var items = cart.items;
        var $tableCart = this.$formCart.find(".shopping-cart");
        var $tableCartBody = $tableCart.find("tbody");

        if (items.length == 0) {
          $tableCartBody.html("");
        } else {


          for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var product = item.product;
            var price = this.currency + " " + item.price;
            var qty = item.qty;
            var html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>";
            html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";

            $tableCartBody.html($tableCartBody.html() + html);
          }

        }

        if (items.length == 0) {
          this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
        } else {

          var total = this.storage.getItem(this.total);
          this.$subTotal[0].innerHTML = this.currency + " " + total;
        }
      } else if (this.$checkoutCart.length) {
        var checkoutCart = this._toJSONObject(this.storage.getItem(this.cartName));
        var cartItems = checkoutCart.items;
        var $cartBody = this.$checkoutCart.find("tbody");

        if (cartItems.length > 0) {

          for (var j = 0; j < cartItems.length; ++j) {
            var cartItem = cartItems[j];
            var cartProduct = cartItem.product;
            var cartPrice = this.currency + " " + cartItem.price;
            var cartQty = cartItem.qty;
            var cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";

            $cartBody.html($cartBody.html() + cartHTML);
          }
        } else {
          $cartBody.html("");
        }

        if (cartItems.length > 0) {

          var cartTotal = this.storage.getItem(this.total);
          var cartShipping = this.storage.getItem(this.shippingRates);
          var subTot = this._convertString(cartTotal) + this._convertString(cartShipping);

          this.$subTotal[0].innerHTML = this.currency + " " + this._convertNumber(subTot);
          this.$shipping[0].innerHTML = this.currency + " " + cartShipping;
        } else {
          this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
          this.$shipping[0].innerHTML = this.currency + " " + 0.00;
        }

      }
    }
