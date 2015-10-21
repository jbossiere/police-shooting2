var map;
var data;

// Function to draw your map
var drawMap = function() {
  map = L.map('mymap').setView([35.25, -98.88], 4);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
     maxZoom: 18,
     id: 'jbossiere.cifu543lk1lhpudm0h9cfsnag',
     accessToken: 'pk.eyJ1IjoiamJvc3NpZXJlIiwiYSI6ImNpZnU1NDR5ZzFsYjd0Z2x5MTI3Ym8zbmsifQ.JQrEEzRo9GxQYlygE4qaHg'
  }).addTo(map);
  getData(); 
}

// Function for getting data
var getData = function() {
  $.ajax({
    url: './../data/response.json',
    type: 'get',
    success: function(response) { //success function by default the first variable is the data that comes back from the url request
      data = response,
      customBuild()
    },
    dataType: 'json'
  });
}

var customBuild = function() {
  var unknownG = new L.layerGroup([]);
  var male = new L.layerGroup([]);
  var female = new L.layerGroup([]);
  var unknownHitCount = 0;
  var unknownKillCount = 0;
  var maleHitCount = 0;
  var maleKillCount = 0;
  var femaleHitCount = 0;
  var femaleKillCount = 0;

  data.forEach(function(d) {
    var lat = d['lat'];
    var lng = d['lng'];
    var gender = d["Victim's Gender"];
    var summary = d["Summary"];
    var link = d["Source Link"];
    var hitKill = d["Hit or Killed?"];

    if (gender == 'Unknown') {
      if (hitKill == "Hit") {
        unknownHitCount++;
      } else {
        unknownKillCount++;
      }
      var circle = new L.circleMarker([lat, lng], {color: '#66FF66', radius: 5});
      circle.addTo(unknownG);
    } else if (gender == "Male") {
      if (hitKill == "Hit") {
        maleHitCount++;
      } else {
        maleKillCount++;
      }        
      var circle = new L.circleMarker([lat, lng], {color: '#0099FF', radius: 5});
      circle.addTo(male);
    } else {
      if (hitKill == "Hit") {
        femaleHitCount++;
      } else {
        femaleKillCount++;
      }        
      var circle = new L.circleMarker([lat, lng], {color: '#FF99FF', radius: 5});
      circle.addTo(female);
    }

    unknownG.addTo(map);
    male.addTo(map);
    female.addTo(map);
    circle.bindPopup(summary + "(link)".link(link));

  });
  var overLays = {
    "Unkown": unknownG,
    "Male": male,
    "Female": female
  };
  $('#td1').html(maleHitCount);
  $('#td2').html(femaleHitCount);
  $('#td3').html(unknownHitCount);
  $('#td4').html(maleKillCount);
  $('#td5').html(femaleKillCount);
  $('#td6').html(unknownKillCount);
  L.control.layers(null, overLays).addTo(map);
}


