//---------- update content from google sheet
var globalData = {};
var sheetKey = "1Y5gtD0hx9_HVPn8z2xhE94isolQvizszYNrcE8b8MC0";
var apiKey = "AIzaSyDarLhb6rGyePmRz2oHAltaZSQYjElyATQ";
var sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+sheetKey+"/values/";

var discountElm = "discount-list";

//discount data
getsheetData(sheetUrl+"feature-products").then(function(data){
	var tempStr = updateTemplate($("#"+discountElm).html(), data),
		tempElm = document.getElementById(discountElm);

	tempElm.innerHTML = tempStr.join(" ");
});





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
			t = t.replace("{{"+k+"}}", v[k]);
		});
		tempArray.push(t);
	});
	return tempArray;
}
