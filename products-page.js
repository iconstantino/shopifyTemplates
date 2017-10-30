var client = ShopifyBuy.buildClient({
    accessToken: '4d7415c180725ab4c41f2e8f67b947b5',
    domain: 'mobstar-clothing.myshopify.com',
    appId: '6'
});

var total = $('.subtotal');
var itemCount = $('.item-count');
var productDiv = $('#product-div');
var cartContents = $('#cart-contents');
var cartDiv = $('#cart-ul');
var checkout = $('.checkout-btn');


client.fetchRecentCart().then(function(cart) {
    function updateCart(item) {
        console.log(item);
        let time = new Date();
        time = time.getHours() + '-' + time.getMinutes() + '-' + time.getMilliseconds();
        console.log(time);

        cartContents.append(`
							<li>
								<div class="header-cart_product_list_item clearfix">
									<a class="item-preview" href="product-page.php?id=${item.product_id}"><img src="${item.image.src}" alt="Product"></a>
									<h4><a class="font-additional font-weight-normal hover-focus-color" href="product-page.php?id=${item.product_id}">${item.title} - ${item.variant_title}</a></h4>
									<span class="item-cat font-main font-weight-normal"><a class="hover-focus-color">Quantity: ${item.quantity}</a></span>
									<span class="item-price font-additional font-weight-normal customColor">${item.price} USD</span>
									<a class="item-del hover-focus-color remove-item" item-qty="${item.quantity}" item-id="${item.id}"><i class="fa fa-trash-o"></i></a>
								</div>
							</li>`);
        cartDiv.append(`
					<li class="wow fadeInUp" data-wow-delay="0.3s">
						<div class="product-list_item row" style="border-bottom: 1px dashed black;">
							<div class="product-list_item_img col-lg-4 col-md-4 col-sm-4 col-xs-4 clearfix">
								<a href="product-page.php?id=${item.product_id}">
									<img style="max-height: 200px;" class="product-list_item_img" src="${item.image.src}" alt="${item.title} Image">
								</a>
							</div>
							<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 clearfix">
								<div class="product-list-info">
									<div class="product-list_item_title">
										<h3 class="font-additional font-weight-bold text-uppercase">${item.title}</h3>
										
									</div>
									<div class="product-item_price font-additional font-weight-normal customColor">Price:$${item.price}<br></div>
									<div>Current Quantity: ${item.quantity}<br>Size: ${item.variant_title}</div>
									<div class="product-list_item_desc font-main font-weight-normal color-third">${item.description}</div>
									<div class="product-options_row">
									<div class="product-counter">
										<input class="font-main font-weight-normal" type="text" name="product-qty" id="productQuantity${item.variant_id}${time}" value="${item.quantity}" readonly="readonly">
										<div class="productCounter addQuantity font-main hover-focus-color" data-counter-step="1" data-counter-type="add" data-counter-field="#productQuantity${item.variant_id}${time}">+</div>
										<div class="productCounter minusQuantity font-main hover-focus-color" data-counter-step="1" data-counter-type="minus" data-counter-field="#productQuantity${item.variant_id}${time}">-</div>
									</div>
									<a class="btn button-additional font-additional font-weight-normal text-uppercase hvr-rectangle-out hover-focus-bg before-bg update-quantity"  item-id="${item.id}" variant-id="${item.variant_id}${time}" style="margin-left: 10px; border: 1px solid black;">
										<span class="icon-refresh" aria-hidden="true"></span>
										update quantity
									</a>
								</div>
								</div>
							</div>
						</div>
					</li>`);
        $('.update-quantity').click(function() {
            var itemId = $(this).attr('item-id');
            var variantId = $(this).attr('variant-id')

            var qty = $('#productQuantity' + variantId).val();
            console.log(qty);
            cart.updateLineItem(itemId, qty);

            cartContents.empty();
            cartDiv.empty();
            cart.lineItems.forEach(updateCart);
            total.text('$ ' + cart.subtotal);
            itemCount.text(cart.lineItemCount + ' ITEM(S)');
            console.log(cart.subtotal);
        });

        $('.remove-item').click(function() {
            var itemId = $(this).attr('item-id');
            var currentQty = $(this).attr('item-qty');

            cart.updateLineItem(itemId, currentQty - 1);
            cartContents.empty();
            cartDiv.empty();
            cart.lineItems.forEach(updateCart);
            total.text('$ ' + cart.subtotal);
            itemCount.text(cart.lineItemCount + ' ITEM(S)');
            console.log(cart.subtotal);
        });
    }


    total.text('$ ' + cart.subtotal);
    itemCount.text(cart.lineItemCount + ' ITEM(S)');
    cartContents.empty();
    cart.lineItems.forEach(updateCart);


    checkout.click(function() {
        window.open(cart.checkoutUrl);
    });

    client.fetchQueryProducts({
        tag: ['featured']
    }).then(products => {
        var featuredList = $('#featured-list');
        products.forEach(function(product) {
            featuredList.append(`
								<li class="col-sm-3 wow fadeInUp" data-wow-delay="0.3s">
							<div class="product-item hvr-underline-from-center">
								<div class="product-item_body">
									<img class="product-item_image" src="${product.images[0].src}" alt="Product">
									<a class="product-item_link" href="product-page.php?id=${product.id}">
									</a>
									<ul class="product-item_info transition">
										<li>
										</li>
										<li>
											<a href="product-page.php?id=${product.id}">
												<span class="icon-eye" aria-hidden="true"></span>
												<div class="product-item_tip font-additional font-weight-normal text-uppercase customBgColor color-main transition">VIEW</div>
											</a>
										</li>
										<li>
										</li>													
									</ul>
								</div>
								<a href="product-details.html" class="product-item_footer">
									<div class="product-item_title font-additional font-weight-bold text-center text-uppercase">${product.title}</div>
									<div class="product-item_price font-additional font-weight-normal customColor">$ ${product.selectedVariant.price}</div>
								</a>
							</div>
						</li>`);
        });
    });
});