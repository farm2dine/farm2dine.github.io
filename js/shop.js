$('document').ready(function(e){
	document.onscroll = function(e) {
		updateNavColor();
	}
	updateNavColor();
});
function updateNavColor() {
	if(window.scrollY > 200) {
		$('nav.navbar').addClass('scroll');
	} else if($('nav.navbar').hasClass('scroll')) {
		$('nav.navbar').removeClass('scroll');
	}
}


var globalData = {};
var sheetKey = "1Y5gtD0hx9_HVPn8z2xhE94isolQvizszYNrcE8b8MC0";
var apiKey = "AIzaSyDarLhb6rGyePmRz2oHAltaZSQYjElyATQ";
var sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetKey+"/values/";

var discountElm = "product-list";
var categoryElm = "catergory-select";


//discount data
getsheetData(sheetUrl+"products").then(function(data){
	var tempStr = updateTemplate($("#"+discountElm).html(), data),
		tempElm = document.getElementById(discountElm);

	tempElm.innerHTML = tempStr.join(" ");

	$('.show-detail').on("click", function(e){
		var parentElm = $(e.currentTarget).parents(".product-action"),
			detailWrap = parentElm.siblings(".product-detail-wrap");

		$('html').addClass("no-scroll");
		$(detailWrap).show();

	});

	$('.close-detail').on("click", function(e){
		var parentElm = $(e.currentTarget).parents(".product-detail-wrap");

		parentElm.hide();
		$('html').removeClass("no-scroll");
	});
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

function getsheetData(url) {
	var getProm = new Promise(function(resolve, reject) {
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
