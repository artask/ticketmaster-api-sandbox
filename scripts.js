var page = 0;
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getEvents(page) {
  $("#events-panel").show();
  $("#attraction-panel").hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }
    
  var d = new Date();
  var n = d.toISOString().substring(0, 19)+"Z";

  
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=TNhkRN7RsNGPaGk7Jh7aH2RFzAvMGEy9&startDateTime="+n+"&venueId=KovZ917A5_7&size=8&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}






function getPrices(id) {
    
}









function showEvents(json) {
  $('#events').html('');    

  var events = json._embedded.events;
    
  var display = [];
    
  for (var i=0;i<events.length;i++) {
      display[events[i].dates.start.localDate] = display[events[i].dates.start.localDate] || [];
      display[events[i].dates.start.localDate].push(events[i]);
  }
  //console.log(display);
  showEvents.prices = [];  
  for (var i=0;i<events.length;i++) {
    var price = '';
    $.ajax({
        type:"GET",        
        url:"https://app.ticketmaster.com/commerce/v2/events/"+events[i].id+"/offers.json?apikey=TNhkRN7RsNGPaGk7Jh7aH2RFzAvMGEy9",
        async:false,
        dataType: "json",
        success: function(json) {
            offers = json.offers;
            //console.log(offers);
            
            for (var i=0;i<offers.length;i++) {
                if (offers[i].attributes.name == "ADULT") {
                    price = parseInt(offers[i].attributes.prices[0].value);
                    price++
                    price = "$"+price;
                    showEvents.prices[events[i].id] += "Regular - " + price + "<br>";          
                }
                if (offers[i].attributes.name == "PREM") {
                    price = parseInt(offers[i].attributes.prices[0].value);
                    price++
                    price = "$"+price;
                    showEvents.prices[events[i].id] += "Premium - " + price + "<br>";          
                }
            }            
        },
        error: function(xhr, status, err) {
  		    console.log(err);
  		}
    });     
  }
console.log(showEvents.prices);    
    
  for (var i=0;i<events.length;i++) {
    var dateTime = events[i].dates.start.dateTime;
    var d = new Date(dateTime);      
    var n = weekday[d.getDay()];  

    var html = '<div class="list-group-item" style="display: inline-block; width: 135px;"><h4 class="list-group-item-heading">'+ n +'</h4><p class="list-group-item-text">' + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + '</p><p class="venue">'+ formatAMPM(d) +'</p><p class="price">' + events[i].prices2 +'</p></div>';
      $('#events').append(html); 
    
      
  }
}

$("#prev").click(function() {
  getEvents(--page);
});

$("#next").click(function() {
  getEvents(++page);
});

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

getEvents(page);