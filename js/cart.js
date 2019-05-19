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

    } else {
        $("#cart-table").html("Cart is empty, <a href='/shop.html'>continue shopping here</a>...");
    }
}

function calcTotal(cartData) {
    var subTotal = 0, gst = 0;
    
    cartData.forEach(function(v,i) {
        subTotal += parseInt(v.total, 10);
    });
    
    return subTotal;
}

cartLoad(templateStr);