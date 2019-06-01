var cartElm = "cart-line-item";
var templateStr = $("#"+cartElm).html();
function cartLoad(tmp) {
    var cartData = getLocalStorageItem("CART");
    if(cartData) {
        var tempStr = updateTemplate(tmp, cartData),
            tempElm = document.getElementById(cartElm);

        tempElm.innerHTML = tempStr.join(" ");

        $('.cart-action').on("click", function(e) {
            var itemId = $(e.currentTarget).attr("data-item-id"),
                count = $(e.currentTarget).hasClass("add-qty") && 1 || -1,
                itemObj;
            for(var i=0; i < cartData.length; i++) {
                if(itemId == cartData[i].id) {
                    setLocalStorageItem('CART', JSON.stringify(addToCart(cartData[i], count)));
                    cartLoad(templateStr);
                    break;
                }
            }
        });
        
        $("#sub-total").html(calcTotal(cartData));

        $("#qty-form").on("submit",function(e){
            e.preventDefault();
            var itemId = $(e.currentTarget).attr("data-item-id");
            var newVal  = parseInt($("#qty-val").val(),10),
                oldVal  = parseInt($("#qty-val").attr("data-old-val"),10),
                qty     = newVal - oldVal;

            for(var i=0; i < cartData.length; i++) {
                if(itemId == cartData[i].id) {
                    setLocalStorageItem('CART', JSON.stringify(addToCart(cartData[i], qty)));
                    cartLoad(templateStr);
                    break;
                }
            }

        })

    } else {
        $("#cart-table").html("Cart is empty, <a href='/shop'>continue shopping here</a>...");
    }
}

function qytUpdate(e) {
    e.preventDefault();
    var cartData = getLocalStorageItem("CART");
    var inputElm = $(e.currentTarget).find(".qty-control");
    var itemId  = inputElm.attr("data-item-id");
    var newVal  = parseInt(inputElm.val(),10),
        oldVal  = parseInt(inputElm.attr("data-old-val"),10),
        qty     = newVal - oldVal;

    for(var i=0; i < cartData.length; i++) {
        if(itemId == cartData[i].id) {
            setLocalStorageItem('CART', JSON.stringify(addToCart(cartData[i], qty)));
            cartLoad(templateStr);
            break;
        }
    }
    return false;
}

function calcTotal(cartData) {
    var subTotal = 0, gst = 0;
    
    cartData.forEach(function(v,i) {
        subTotal += parseInt(v.total, 10);
    });
    
    return subTotal;
}

function removeItem(id) {
    var cartData    = getLocalStorageItem('CART'),
        newCart = [];

    for(var i = 0; i < cartData.length; i++) {
        if(cartData[i].id != id) {
            newCart.push(cartData[i]);
        }
    }
    if(newCart.length == 0){
        localStorage.removeItem("CART");
    } else {
        setLocalStorageItem('CART', JSON.stringify(newCart));
    }
    cartLoad(templateStr);
    updateCartCount()
}

cartLoad(templateStr);

$('document').ready(function(e){
	$("#place-order").on("click", function(e) {
		$(".order-form-wrap").toggleClass("show");
	});
	$("#close-order-form").on("click", function(e) {
		e.preventDefault();
		$(".order-form-wrap").toggleClass("show");
	});

	$("#order-submit").on("submit", function(e){
		e.preventDefault();
		var OrderSubmitURL = "https://script.google.com/macros/s/AKfycbznZJzncZ5E6wulgLmIU6L51MO5FHHica9vQjbVm4fZHU6UfV0/exec?";
		var name 	= $("#name").val(),
			phone 	= $("#phone").val(),
			cartObj = getLocalStorageItem("CART").map(function(v,i){
				return v.title+"^"+v.count;
			}),
			postURL = OrderSubmitURL+"name="+name+"&phone="+phone+"&order="+encodeURIComponent(cartObj.join("|"));

		$.get(postURL).then(function(data) {
			var poupElm = document.getElementById("order-form-popup");
			poupElm.innerHTML = '<h4 class="text-success">'+data+'</h4><br/><a href="/shop">Continue Shopping</a>';
			localStorage.removeItem("CART");

		});

	})
});
