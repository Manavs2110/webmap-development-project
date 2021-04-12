 
var   featureList, boroughSearch = [], theaterSearch = [], museumSearch = [];
const map=L.map('map').setView([22.9074872, 79.07306671],2);
const tileUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution='&copy; <a href="http://floodlist.com/">Floodlist</a>❤️';
const tileLayer = L.tileLayer(tileUrl, {  attribution });
tileLayer.addTo(map);

var footprint;
var coordinatesarray;
var cell_data;
var actualdata;
var country;
var s1,s2,s3,s4,s5;
var datacheck;
var satellites;
var employee_data;
var flooddatasearch;
var csvflooddata;
 var ispaused=false;
 var issubmit=false;
 var startdate;
 var enddate;
 var setstart;
 var setend;
 var requireddata=[];
 var finaldata=[];
 var floodname=[];
 var csvfloodsarray=[];
 var selectcountry;
 var detaildata; 
$(document).ready(function(){
    
  $.ajax({
   url:'https://agile-hollows-34401.herokuapp.com/flooddata',
   type: 'GET',
   
   success:function(allflood)
   { 
 
    actualdata=allflood;
    console.log(actualdata);
  if(typeof(actualdata)=="object"){
    issubmit=true;
    $("#loading").hide();
    $("#pano").hide();
  }
  

}
   ,
   error:function(error)
   { 
    console.log(error);
     
    }
  });});

    
  function formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0] , // get only two digits
    month = datePart[1], day = datePart[2];
  
    return day+'/'+month+'/'+year;
  }
  function getVal(){
    requireddata.length=0;
    $("#panel-heading").hide();
     
    var x = document.getElementById("startdate").value
     var  y= document.getElementById("enddate").value
     selectcountry= document.getElementById("countries").value;
     if(document.getElementById("planet").checked ===true ||document.getElementById("sentinal2").checked ===true||document.getElementById("digital").checked ===true){
       document.getElementById("opticalorsardata").innerHTML=" <h3 class='panel-title'style='background-color:#F0F3F4 ;padding:10px;'>Optical Satellite Sensors</h3> ";
     }
     if(document.getElementById("sentinal1").checked ===true ||document.getElementById("alos2").checked ===true ){
      document.getElementById("opticalorsardata").innerHTML=" <h3 class='panel-title'style='background-color:#F0F3F4;padding:10px;'>SAR Satellite Sensors</h3> ";
    }
    if((document.getElementById("planet").checked ===true ||document.getElementById("sentinal2").checked ===true||document.getElementById("digital").checked ===true)&&(document.getElementById("sentinal1").checked ===true ||document.getElementById("alos2").checked ===true )){
      
    //  document.getElementById("opticaldata").innerHTML=" <h3 class='panel-title'style='background-color:#F0F3F4;padding:10px;'>Optical Satellite Sensors</h3> ";
    //  document.getElementById("sardata").innerHTML=" <h3 class='panel-title'style='background-color:#F0F3F4;padding:10px;'>SAR Satellite Sensors</h3> ";
    document.getElementById("opticalorsardata").innerHTML=" <h3 class='panel-title'style='background-color:#F0F3F4;padding:10px;'>Optical & SAR Satellite Sensors</h3> ";
   
    }
     if(document.getElementById("planet").checked ===true){
     s1= document.getElementById("planet").value;
      }
     if(document.getElementById("sentinal1").checked ===true){
     s2= document.getElementById("sentinal1").value;
      }
     if(document.getElementById("sentinal2").checked ===true){
     s3= document.getElementById("sentinal2").value;}
     if(document.getElementById("digital").checked ===true){
     s4= document.getElementById("digital").value;}
     if(document.getElementById("alos2").checked ===true){
     s5= document.getElementById("alos2").value;}
     x = x.replace(/\-/g, '/');
     y=y.replace(/\-/g, '/');
       setstart=formatDate(x);
       setend=formatDate(y);
       
   
  
   
    // var flooddatasearch = JSON.parse(actualdata);
   
  
  for(var j=0;j<actualdata.length;j++){
  
         
      
        startdate=actualdata[j]["StartDate"];
        enddate=actualdata[j]["EndDate"];
        country=actualdata[j]["CountryName"];
        satellites=actualdata[j]["SatelliteName"];
        var d1 = setstart.split("/");
  var d2 =setend.split("/");
  var c1 = startdate.split("/");
  var c2=enddate.split("/");
  var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
  var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
  var check1 = new Date(c1[2], parseInt(c1[1])-1, c1[0]);
  var check2 = new Date(c2[2], parseInt(c2[1])-1, c2[0]);
  if((check1 > from && check1 < to)&&(check2 > from && check2 < to)&&selectcountry===country && (s1===satellites ||s3===satellites||s4===satellites )){
       console.log("in date range" +selectcountry);
       requireddata.push(actualdata[j]["FloodCSVData"]);
       floodname.push("Flood data-"+country+" from "+startdate+" to "+enddate +" "+satellites+" data");
  }
  else if((check1 > from && check1 < to)&&(check2 > from && check2 < to)&&selectcountry===country && (s2===satellites ||s5===satellites )){
    console.log("in date range" +selectcountry);
    requireddata.push(actualdata[j]["FloodCSVData"]);
    floodname.push("Flood data-"+country+" from "+startdate+" to "+enddate +" "+satellites+" data");
}
else if((check1 > from && check1 < to)&&(check2 > from && check2 < to)&&selectcountry===country &&   (s1===satellites ||s3===satellites||s4===satellites ) && (s2===satellites ||s5===satellites )){
  console.log("in date range" +selectcountry);
  requireddata.push(actualdata[j]["FloodCSVData"]);
  floodname.push("Flood data-"+country+" from "+startdate+" to "+enddate +" "+satellites+" data");
}
   
   else if(j==actualdata.length-1 &&requireddata.length==0){
     alert("no data found");
   }
  // console.log(check1 > from && check1 < to);
  // console.log("to");
  // console.log(check2 > from && check2 < to);
  }
  
   
  if(requireddata.length !=0){
  for(var l=0;l<requireddata.length;l++){
  for(var k=0;k<requireddata[l].length;k++){
    requireddata[l][k]["footprint"]= JSON.stringify(requireddata[l][k]["footprint"]);
    
     
    if(k==requireddata[l].length-1){
      ispaused=true;
    }
   }
  }
  console.log(requireddata);
  //convert json to csv 
  for(var f=0;f<requireddata.length;f++){
    for(var g=0;g<requireddata[f].length;g++){
      delete requireddata[f][g]["permissions"];
      delete requireddata[f][g]["links_self"];
      delete requireddata[f][g]["links_assets"];
      delete requireddata[f][g]["links_thumbnail"];
      delete requireddata[f][g]["clear_confidence_percent"];
      delete requireddata[f][g]["clear_percent"];
      delete requireddata[f][g]["columns"];
      delete requireddata[f][g]["ground_control"];
      delete requireddata[f][g]["heavy_haze_percent"];
      delete requireddata[f][g]["light_haze_percent"];
      delete requireddata[f][g]["pixel_resolution"];
      delete requireddata[f][g]["published"];
       delete requireddata[f][g]["publishing_stage"];
       delete requireddata[f][g]["quality_category"];
       delete requireddata[f][g]["rows"]; 
       delete requireddata[f][g]["satellite_id"];
       delete requireddata[f][g]["shadow_percent"];
       delete requireddata[f][g]["snow_ice_percent"];
       delete requireddata[f][g]["strip_id"];
       delete requireddata[f][g]["sun_azimuth"];
       delete requireddata[f][g]["link"];
       delete requireddata[f][g]["sun_elevation"];
       delete requireddata[f][g]["updated"];
       delete requireddata[f][g]["view_angle"];
       delete requireddata[f][g]["visible_confidence_percent"];
       delete requireddata[f][g]["visible_percent"];

    }
  flooddatasearch=requireddata[f];
  console.log(requireddata[f]);
  var fields = Object.keys(flooddatasearch[0])
  var replacer = function(key, value) { return value === null ? '' : value } 
   csvflooddata =flooddatasearch.map(function(row){
    return fields.map(function(fieldName){
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csvflooddata.unshift(fields.join(',')) // add header column
  csvflooddata  = csvflooddata.join('\r\n');
  csvfloodsarray.push(csvflooddata);
}
    
      // document.getElementById("load_data").innerHTML="Load Data";
      if(issubmit){
   var text = "";
      for (var i =0;i<requireddata.length;i++)
      {   
       
        // if(i>0){text=text+"<hr style='height:1px;border-width:0px;color:gray;background-color:gray'/>";}  
               text = text + "<li name='load_data' id='#load_data'  onclick='usershowtable("+i+");' ><img width='16' height='18' src='assets/img/flood.png'>"+floodname[i] +"  </li>  <div id='user-list"+i+"' style='overflow: auto;'></div> " ;
              
      
      }
    
    }
    else{
      alert("submit again");
    }
   document.getElementById('feature-list').innerHTML=text;
  }}
  function flytoloaction(i){
    map.flyTo([requireddata[i][0]["Latitude"],requireddata[i][0]["Longitude"]],8,{
      duration:3
    })
    var a=requireddata[i][0]["Latitude"];
    var b=requireddata[i][0]["Longitude"];
    var x=a-1
    var y=a+1
    var  x1=b-1
    var y1=b+1
     
      var latlngs = [ [ x,x1],[ x, y1 ], [ y, y1 ], [ y, x1 ], [x, x1 ]];
      var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
    
    // // zoom the map to the polygon
    // map.fitBounds(polygon.getBounds());
    }
    
    function usershowtable(i){
       
      flytoloaction(i);
         if(ispaused){
       
        employee_data =csvfloodsarray[i].split(/\r?\n|\r/);
        detaildata=employee_data;
            var table_data = '<ol><li ><b>Select </b>&nbsp;&nbsp;&nbsp;'+"          "+'<b>Sensor </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+"          "+'<b>Acquired</b>&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+"          "+'<b>Cloud Cover</b>&nbsp;&nbsp;&nbsp;&nbsp;'+"          "+'<b>Provider</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '+"          "+'<b>Details</b></li>';
            for(var count = 1; count<employee_data.length; count++)
            {     
                    // //you will get acctual output in array
                    // if(count>1){
                    //   table_data +=  '<li >Select'+"          "+'Sensor'+"          "+' Acquired'+"          "+'Cloud Cover'+"          "+'Provider'+"          "+'Details';
                   
                        
                    //   }
              
            cell_data = employee_data[count].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                  
            
            if(cell_data[8].length===3){
              cell_data[8]+="0";
            }
            if(cell_data[8].length===1){
            cell_data[8]+=".00";
            }
          
            // if(cell_data[12].length===3){
            //    table_data +=  '<li  onclick="Loadcsv('+count+');">'+' <input type="checkbox" class="custom-control-input" id="customCheck">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+"          "+cell_data[12].replace(/"/g,"")+ "<b>.DD</b>"+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[6].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[8].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[16].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'<i class="fa fa-plus-circle" style="font-size:20px;color:black"></i> </li> <div id="employee_table'+count+'" style="overflow: auto;"></div>';
            // // }
        
                table_data +=  '<li  onclick="Loadcsv('+count+');">'+' <input type="checkbox" class="custom-control-input" id="customCheck">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+"          "+cell_data[12].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[6].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[8].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cell_data[16].replace(/"/g,"")+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'<i class="fa fa-plus-circle" style="font-size:20px;color:black"></i> </li> <div id="employee_table'+count+'" style="overflow: auto;"></div>';
                // document.getElementById("customCheck").checked = false;
                // if(document.getElementById("customCheck").checked===true){
                //   rowclick(i);
                //   }
             
               // console.log(cell_data[8].length);
              //  table_data += '  <td>  '+cell_data[6].replace(/"/g,"")+'</td>';
              
              //  table_data += '  <td>  '+cell_data[8].replace(/"/g,"")+'</td>';
              //  table_data += '  <td>  '+cell_data[16].replace(/"/g,"")+'</td>';
              //  table_data += '  <td>   <i class="fa fa-plus-circle" style="font-size:20px;color:black"></i> </li> <div id="employee_table'+i+'" style="overflow: auto;"></div>';
             }
           
            }
            table_data+='</ol>'
          
        document.getElementById('user-list'+i+'').style.height = 50+ "vh";
         $('#user-list'+i+'').html(table_data);
        
       
    }
    function Loadcsv(i){
         
         if(ispaused){
       
     
            var table_data1 = '<table class="table table-bordered table-striped"  > ';
            for(var count = 0; count<2; count++)
            {     
                    //you will get acctual output in array
              if(count==0){
              cell_data = detaildata[count].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);}
              else{
                cell_data = detaildata[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
              }
                  
             table_data1 += ' <tr id="roweve"  onclick="rowclick(this)"  >  ';
             for(var cell_count=0; cell_count<cell_data.length; cell_count++)
             {
              if(count === 0)
              {
               table_data1 += '  <th>  '+cell_data[cell_count]+'</th>';
                 
              }
              
              else{
                table_data1 += '<td>'+cell_data[cell_count]+'</td>';
              }
             }
             table_data1 += '</tr>';
            }
            table_data1 += '</table>';
            
            // for(var j=0;j<allflood.length;j++){
          // if(i==j){
        document.getElementById('employee_table'+i+'').style.height = 30+"vh";
         $('#employee_table'+i+'').html(table_data1);
      // } }
       
          }
           }
      
      
           
      function rowclick(rowno){
         
       let msg=rowno.cells[4].innerHTML;
       
       var WithOutBrackets=msg.replace(/[\[\]']+/g,'');
       var me=WithOutBrackets.replace(/"/g,"");
               
      //   var obj=  JSON.parse( WithOutBrackets   );
       //alert(typeof(me));
       //we have to do string to integer and understand about how array convert into chunk array
      
        var  coordinates=  me.split(',');
        console.log( coordinates);
      const chunk =  coordinates => {
         const size = 2;
         const chunkedArray = [];
         for (let i = 0; i <  coordinates.length; i++) {
            const last = chunkedArray[chunkedArray.length - 1];
            if(!last || last.length === size){
               chunkedArray.push([ coordinates[i]]);
            }else{
               last.push( coordinates[i]);
            }
         };
         return chunkedArray;
      };
       
             alert(chunk( coordinates));
          var states = [{
          "type": "Feature",
          "properties": {},
          "geometry": {
              "type": "Polygon",
              "coordinates":[[["129.86889616213875", "31.85092400331079"], ["130.13226059277255", "31.804015706859424"], ["130.11415527263486", "31.731335321675704"], ["129.85082873777677", "31.77787200251359"], ["129.86889616213875", "31.85092400331079"]]]
             }
      
      }];
       states[0]["geometry"]["coordinates"]=[chunk( coordinates)];
      console.log(states);
      L.geoJSON(states, {
          style: function(feature) {
              switch (feature.properties.party) {
                  case 'Republican': return {color: "#ff0000"};
                  case 'Democrat':   return {color: "#0000ff"};
              }
          }
      }).addTo(map);
      
      }
// $(document).on("click", ".feature-row", function(e) {
//   $(document).off("mouseout", ".feature-row", clearHighlight);
//   sidebarClick(parseInt($(this).attr("id"), 10));
// });

// if ( !("ontouchstart" in window) ) {
//   $(document).on("mouseover", ".feature-row", function(e) {
//     highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
//   });
// }

// $(document).on("mouseout", ".feature-row", clearHighlight);

// $("#about-btn").click(function() {
//   $("#aboutModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#full-extent-btn").click(function() {
//   map.fitBounds(boroughs.getBounds());
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#legend-btn").click(function() {
//   $("#legendModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#login-btn").click(function() {
//   $("#loginModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#list-btn").click(function() {
//   animateSidebar();
//   return false;
// });

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});
$("#sidebar-hide-btn2").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

// function sizeLayerControl() {
//   $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
// }

// function clearHighlight() {
//   highlight.clearLayers();
// }

// function sidebarClick(id) {
//   var layer = markerClusters.getLayer(id);
//   map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
//   layer.fire("click");
//   /* Hide sidebar and go to the map on small screens */
//   if (document.body.clientWidth <= 767) {
//     $("#sidebar").hide();
//     map.invalidateSize();
//   }
// }

// function syncSidebar() {
//   /* Empty sidebar features */
//   $("#feature-list tbody").empty();
//   /* Loop through theaters layer and add only features which are in the map bounds */
//   theaters.eachLayer(function (layer) {
//     if (map.hasLayer(theaterLayer)) {
//       if (map.getBounds().contains(layer.getLatLng())) {
//         $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       }
//     }
//   });
//   /* Loop through museums layer and add only features which are in the map bounds */
//   museums.eachLayer(function (layer) {
//     if (map.hasLayer(museumLayer)) {
//       if (map.getBounds().contains(layer.getLatLng())) {
//         $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       }
//     }
//   });
//   /* Update list.js featureList */
//   featureList = new List("features", {
//     valueNames: ["feature-name"]
//   });
//   featureList.sort("feature-name", {
//     order: "asc"
//   });
// }

// /* Basemap Layers */
// var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
// });
// var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
//   maxZoom: 15,
// }), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
//   minZoom: 16,
//   maxZoom: 19,
//   layers: "0",
//   format: 'image/jpeg',
//   transparent: true,
//   attribution: "Aerial Imagery courtesy USGS"
// })]);

// /* Overlay Layers */
// var highlight = L.geoJson(null);
// var highlightStyle = {
//   stroke: false,
//   fillColor: "#00FFFF",
//   fillOpacity: 0.7,
//   radius: 10
// };

// var boroughs = L.geoJson(null, {
//   style: function (feature) {
//     return {
//       color: "black",
//       fill: false,
//       opacity: 1,
//       clickable: false
//     };
//   },
//   onEachFeature: function (feature, layer) {
//     boroughSearch.push({
//       name: layer.feature.properties.BoroName,
//       source: "Boroughs",
//       id: L.stamp(layer),
//       bounds: layer.getBounds()
//     });
//   }
// });
// $.getJSON("data/boroughs.geojson", function (data) {
//   boroughs.addData(data);
// });

// //Create a color dictionary based off of subway route_id
// var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
//     "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
//     "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
//     "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
//     "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
//     "Q":"#ffff00", "R":"#ffff00" };

// var subwayLines = L.geoJson(null, {
//   style: function (feature) {
//       return {
//         color: subwayColors[feature.properties.route_id],
//         weight: 3,
//         opacity: 1
//       };
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.Line);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");

//         }
//       });
//     }
//     layer.on({
//       mouseover: function (e) {
//         var layer = e.target;
//         layer.setStyle({
//           weight: 3,
//           color: "#00FFFF",
//           opacity: 1
//         });
//         if (!L.Browser.ie && !L.Browser.opera) {
//           layer.bringToFront();
//         }
//       },
//       mouseout: function (e) {
//         subwayLines.resetStyle(e.target);
//       }
//     });
//   }
// });
// $.getJSON("data/subways.geojson", function (data) {
//   subwayLines.addData(data);
// });

// /* Single marker cluster layer to hold all clusters */
// var markerClusters = new L.MarkerClusterGroup({
//   spiderfyOnMaxZoom: true,
//   showCoverageOnHover: false,
//   zoomToBoundsOnClick: true,
//   disableClusteringAtZoom: 16
// });

// /* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
// var theaterLayer = L.geoJson(null);
// var theaters = L.geoJson(null, {
//   pointToLayer: function (feature, latlng) {
//     return L.marker(latlng, {
//       icon: L.icon({
//         iconUrl: "assets/img/theater.png",
//         iconSize: [24, 28],
//         iconAnchor: [12, 28],
//         popupAnchor: [0, -25]
//       }),
//       title: feature.properties.NAME,
//       riseOnHover: true
//     });
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.NAME);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");
//           highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
//         }
//       });
//       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       theaterSearch.push({
//         name: layer.feature.properties.NAME,
//         address: layer.feature.properties.ADDRESS1,
//         source: "Theaters",
//         id: L.stamp(layer),
//         lat: layer.feature.geometry.coordinates[1],
//         lng: layer.feature.geometry.coordinates[0]
//       });
//     }
//   }
// });
// $.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
//   theaters.addData(data);
//   map.addLayer(theaterLayer);
// });

// /* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
// var museumLayer = L.geoJson(null);
// var museums = L.geoJson(null, {
//   pointToLayer: function (feature, latlng) {
//     return L.marker(latlng, {
//       icon: L.icon({
//         iconUrl: "assets/img/museum.png",
//         iconSize: [24, 28],
//         iconAnchor: [12, 28],
//         popupAnchor: [0, -25]
//       }),
//       title: feature.properties.NAME,
//       riseOnHover: true
//     });
//   },
//   onEachFeature: function (feature, layer) {
//     if (feature.properties) {
//       var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
//       layer.on({
//         click: function (e) {
//           $("#feature-title").html(feature.properties.NAME);
//           $("#feature-info").html(content);
//           $("#featureModal").modal("show");
//           highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
//         }
//       });
//       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       museumSearch.push({
//         name: layer.feature.properties.NAME,
//         address: layer.feature.properties.ADRESS1,
//         source: "Museums",
//         id: L.stamp(layer),
//         lat: layer.feature.geometry.coordinates[1],
//         lng: layer.feature.geometry.coordinates[0]
//       });
//     }
//   }
// });
// $.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
//   museums.addData(data);
// });

// map = L.map("map", {
//   zoom: 10,
//   center: [40.702222, -73.979378],
//   layers: [cartoLight, boroughs, markerClusters, highlight],
//   zoomControl: false,
//   attributionControl: false
// });

// /* Layer control listeners that allow for a single markerClusters layer */
// map.on("overlayadd", function(e) {
//   if (e.layer === theaterLayer) {
//     markerClusters.addLayer(theaters);
//     syncSidebar();
//   }
//   if (e.layer === museumLayer) {
//     markerClusters.addLayer(museums);
//     syncSidebar();
//   }
// });

// map.on("overlayremove", function(e) {
//   if (e.layer === theaterLayer) {
//     markerClusters.removeLayer(theaters);
//     syncSidebar();
//   }
//   if (e.layer === museumLayer) {
//     markerClusters.removeLayer(museums);
//     syncSidebar();
//   }
// });

// /* Filter sidebar feature list to only show features in current map bounds */
// map.on("moveend", function (e) {
//   syncSidebar();
// });

// /* Clear feature highlight when map is clicked */
// map.on("click", function(e) {
//   highlight.clearLayers();
// });

// /* Attribution control */
// function updateAttribution(e) {
//   $.each(map._layers, function(index, layer) {
//     if (layer.getAttribution) {
//       $("#attribution").html((layer.getAttribution()));
//     }
//   });
// }
// map.on("layeradd", updateAttribution);
// map.on("layerremove", updateAttribution);

// var attributionControl = L.control({
//   position: "bottomright"
// });
// attributionControl.onAdd = function (map) {
//   var div = L.DomUtil.create("div", "leaflet-control-attribution");
//   div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
//   return div;
// };
// map.addControl(attributionControl);

// var zoomControl = L.control.zoom({
//   position: "bottomright"
// }).addTo(map);

// /* GPS enabled geolocation control set to follow the user's location */
// var locateControl = L.control.locate({
//   position: "bottomright",
//   drawCircle: true,
//   follow: true,
//   setView: true,
//   keepCurrentZoomLevel: true,
//   markerStyle: {
//     weight: 1,
//     opacity: 0.8,
//     fillOpacity: 0.8
//   },
//   circleStyle: {
//     weight: 1,
//     clickable: false
//   },
//   icon: "fa fa-location-arrow",
//   metric: false,
//   strings: {
//     title: "My location",
//     popup: "You are within {distance} {unit} from this point",
//     outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
//   },
//   locateOptions: {
//     maxZoom: 18,
//     watch: true,
//     enableHighAccuracy: true,
//     maximumAge: 10000,
//     timeout: 10000
//   }
// }).addTo(map);

// /* Larger screens get expanded layer control and visible sidebar */
// if (document.body.clientWidth <= 767) {
//   var isCollapsed = true;
// } else {
//   var isCollapsed = false;
// }

// var baseLayers = {
//   "Street Map": cartoLight,
//   "Aerial Imagery": usgsImagery
// };

// var groupedOverlays = {
//   "Points of Interest": {
//     "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters": theaterLayer,
//     "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
//   },
//   "Reference": {
//     "Boroughs": boroughs,
//     "Subway Lines": subwayLines
//   }
// };

// var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
//   collapsed: isCollapsed
// }).addTo(map);

// /* Highlight search box text on click */
// $("#searchbox").click(function () {
//   $(this).select();
// });

// /* Prevent hitting enter from refreshing the page */
// $("#searchbox").keypress(function (e) {
//   if (e.which == 13) {
//     e.preventDefault();
//   }
// });

// $("#featureModal").on("hidden.bs.modal", function (e) {
//   $(document).on("mouseout", ".feature-row", clearHighlight);
// });

// /* Typeahead search functionality */
// $(document).one("ajaxStop", function () {
//   $("#loading").hide();
//   sizeLayerControl();
//   /* Fit map to boroughs bounds */
//   map.fitBounds(boroughs.getBounds());
//   featureList = new List("features", {valueNames: ["feature-name"]});
//   featureList.sort("feature-name", {order:"asc"});

//   var boroughsBH = new Bloodhound({
//     name: "Boroughs",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: boroughSearch,
//     limit: 10
//   });

//   var theatersBH = new Bloodhound({
//     name: "Theaters",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: theaterSearch,
//     limit: 10
//   });

//   var museumsBH = new Bloodhound({
//     name: "Museums",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     local: museumSearch,
//     limit: 10
//   });

//   var geonamesBH = new Bloodhound({
//     name: "GeoNames",
//     datumTokenizer: function (d) {
//       return Bloodhound.tokenizers.whitespace(d.name);
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     remote: {
//       url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
//       filter: function (data) {
//         return $.map(data.geonames, function (result) {
//           return {
//             name: result.name + ", " + result.adminCode1,
//             lat: result.lat,
//             lng: result.lng,
//             source: "GeoNames"
//           };
//         });
//       },
//       ajax: {
//         beforeSend: function (jqXhr, settings) {
//           settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
//           $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
//         },
//         complete: function (jqXHR, status) {
//           $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
//         }
//       }
//     },
//     limit: 10
//   });
//   boroughsBH.initialize();
//   theatersBH.initialize();
//   museumsBH.initialize();
//   geonamesBH.initialize();

//   /* instantiate the typeahead UI */
//   $("#searchbox").typeahead({
//     minLength: 3,
//     highlight: true,
//     hint: false
//   }, {
//     name: "Boroughs",
//     displayKey: "name",
//     source: boroughsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'>Boroughs</h4>"
//     }
//   }, {
//     name: "Theaters",
//     displayKey: "name",
//     source: theatersBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Theaters</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "Museums",
//     displayKey: "name",
//     source: museumsBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums</h4>",
//       suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//     }
//   }, {
//     name: "GeoNames",
//     displayKey: "name",
//     source: geonamesBH.ttAdapter(),
//     templates: {
//       header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
//     }
//   }).on("typeahead:selected", function (obj, datum) {
//     if (datum.source === "Boroughs") {
//       map.fitBounds(datum.bounds);
//     }
//     if (datum.source === "Theaters") {
//       if (!map.hasLayer(theaterLayer)) {
//         map.addLayer(theaterLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "Museums") {
//       if (!map.hasLayer(museumLayer)) {
//         map.addLayer(museumLayer);
//       }
//       map.setView([datum.lat, datum.lng], 17);
//       if (map._layers[datum.id]) {
//         map._layers[datum.id].fire("click");
//       }
//     }
//     if (datum.source === "GeoNames") {
//       map.setView([datum.lat, datum.lng], 14);
//     }
//     if ($(".navbar-collapse").height() > 50) {
//       $(".navbar-collapse").collapse("hide");
//     }
//   }).on("typeahead:opened", function () {
//     $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
//     $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
//   }).on("typeahead:closed", function () {
//     $(".navbar-collapse.in").css("max-height", "");
//     $(".navbar-collapse.in").css("height", "");
//   });
//   $(".twitter-typeahead").css("position", "static");
//   $(".twitter-typeahead").css("display", "block");
// });

// // Leaflet patch to make layer control scrollable on touch browsers
// var container = $(".leaflet-control-layers")[0];
// if (!L.Browser.touch) {
//   L.DomEvent
//   .disableClickPropagation(container)
//   .disableScrollPropagation(container);
// } else {
//   L.DomEvent.disableClickPropagation(container);
// }


 