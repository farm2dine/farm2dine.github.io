var globalData = {};
var sheetKey = "1Y5gtD0hx9_HVPn8z2xhE94isolQvizszYNrcE8b8MC0";
var apiKey = "AIzaSyDarLhb6rGyePmRz2oHAltaZSQYjElyATQ";
var sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetKey+"/values/";

var discountElm = "product-list";
var categoryElm = "catergory-select";

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

//product data
getsheetData(sheetUrl+"products").then(function(data){
	window.$ProductData = data;
	var tempStr = updateTemplate($("#"+discountElm).html(), data),
		tempElm = document.getElementById(discountElm);
		tempElm.innerHTML = tempStr.join(" ");

	$('.show-detail').on("click", function(e){
		var parentElm = $(e.currentTarget).parents(".product-action"),
			detailWrap = parentElm.siblings(".product-detail-wrap"),
            title = e.currentTarget.getAttribute("data-title"),
            prodId = e.currentTarget.getAttribute("data-id");

		$('html').addClass("no-scroll");
        checkQty(prodId)
		$(detailWrap).show();
        history.pushState({product: title}, title, "?productid="+prodId);
	});

	$('.close-detail').on("click", function(e){
		var parentElm = $(e.currentTarget).parents(".product-detail-wrap");

		parentElm.hide();
		$('html').removeClass("no-scroll");

        history.pushState("","", "?");
	});

    var prodId = getQueryStringValue("productid");

    if(prodId.trim()) {
        $('.product-detail-wrap[data-id="'+prodId+'"]').show();
        checkQty(prodId)
    }

	return getsheetData(sheetUrl+"categories");
}).then(function(data){
	var tempStr = updateTemplate($("#"+categoryElm).html(), data),
		tempElm = document.getElementById(categoryElm);

	tempElm.innerHTML = tempStr.join(" ");


	$('.category-checkbox-input').on("change",function(e){
		updateFiler();
	});

	$("#clear-filer").on("click", function(e){
		$(".category-checkbox-input").prop("checked", false);
		updateFiler();
	});
	$("#filter-toggle").on("click", function(e){
		$("#catergory-select").toggleClass("show");
	});

//	var nameArray = data.map(function(v,i) {
//		return v.name;
//	});
//	console.log(nameArray);
});


function checkQty(prodId) {
    var cartData = getLocalStorageItem("CART");

    if(cartData) {
        for(var i=0; i < cartData.length; i++) {
            if(prodId == cartData[i].id) {
                var qty = cartData[i].count;
                $('.added-msg[data-id="'+prodId+'"]').show();
                //$('.cart-btn[data-id="'+prodId+'"]').html('<i class="fas fa-shopping-cart"></i> Added to Cart ('+qty+')');
                break;
            }
        }
    }
}

function updateFiler() {
	var isEmpty = true;

	$(".products-line-item").hide();
	$('.category-checkbox-input').each(function(i,elm){
		if(elm.checked) {
			var checkValue = elm.value;
			$('[data-category="'+checkValue+'"]').show();
			isEmpty = false;
		}
	});
	if(isEmpty) {
		$(".products-line-item").show();
		$("#clear-filer").hide(500);
	} else {
		$("#clear-filer").show(500);
	}
}

function handleAddToCartBtnClick(e) {
    var qtyVal = $(e.currentTarget).find(".product-qty").val();

	var index = e.currentTarget.dataset["id"];
	var item = window.$ProductData.filter(function(val) {
		return val.id == index;
	})[0];
	//Selecting the values to store in localstorage
	var keys = ['description', 'discount','long_desc','category', 'image_name'];
	var dataObj = Object.keys(item)
        .filter(k => !keys.includes(k))
        .map(k => Object.assign({}, {[k]: item[k]}))
		.reduce((res, o) => Object.assign(res, o), {});
	var oldCart = getLocalStorageItem('CART');
    
    dataObj.count = qtyVal && parseInt(qtyVal, 10) || 1;
    dataObj.total = dataObj.discount_price;
    if(oldCart) {
        updatedCart = addToCart(dataObj, qtyVal && parseInt(qtyVal, 10) || 1);
    } else {
        updatedCart = [dataObj];
    }
	setLocalStorageItem('CART', JSON.stringify(updatedCart));
    updateCartCount();

    checkQty(index);
    $(".add-to-cart-msg[data-item-id="+index+"]").fadeIn(500);
    $(".add-to-cart-msg[data-item-id="+index+"]").delay(5000).fadeOut(1000);
//    $('.cart-btn[data-id="'+index+'"]').html('<i class="fas fa-shopping-cart"></i> Added to Cart');
}
