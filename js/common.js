$('document').ready(function(e){
		document.onscroll = function(e) {
		updateNavColor();
	}
	updateNavColor();

	$('.mobile-menu').on("click", function(e) {
		$(this).toggleClass("clicked");
		$(".navbar-nav").toggleClass("mobile-nav");
	});
});
function updateNavColor() {
	if(window.scrollY > 200) {
		$('nav.navbar').addClass('scroll');
	} else if($('nav.navbar').hasClass('scroll')) {
		$('nav.navbar').removeClass('scroll');
	}
}

function getsheetData(url) {
	var getProm = new Promise(function(resolve, reject) {0
		return $.get(url+"?key="+apiKey,function(data) {
			var arr = [], val = data.values, feilds = data.values[0];
			for(var i=1; i < val.length; i++) {
				var row = {};

				feilds.map(function(v,inner){
					row[v] = val[i][inner] || "N/A";
				});

				arr.push(row);
			}
			resolve(arr);
		});
	});
	return getProm;
};

function updateTemplate(template, data) {
	var tempArray = [];
	data.map(function(v,i){

		var allKeys = Object.keys(v), t = template;
		allKeys.map(function(k,inn){
			var str = new RegExp("{{"+k+"}}", "g");
			t = t.replace(str, v[k]);
		});
		tempArray.push(t);
	});
	return tempArray;
}

function getLocalStorageItem(value) {
    return JSON.parse(localStorage.getItem(value));
}

function setLocalStorageItem(key, value) {
    return localStorage.setItem(key, value);
}

function addToCart(data, times) {
    var cartData    = getLocalStorageItem('CART'),
        isNew       = false;

    for(var i = 0; i < cartData.length; i++) {
        var qty = parseInt(cartData[i].count, 10) + times;
        if(cartData[i].id == data.id) {
            cartData[i].count = (qty > 0 ? qty : 1) + "";
            cartData[i].total = parseInt(cartData[i].count, 10) * parseInt(cartData[i].discount_price, 10) + "";
            isNew = false;
            break;
        } else {
            isNew = true;
        }
    }
    (isNew && cartData.push(data))
    
    return cartData;
}

