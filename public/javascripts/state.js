/////////////////--------> State's <--------------\\\\\\\\\\\\\\

$(document).ready(function () {
  $.getJSON("http://localhost:3000/employee/fetchstates", function (data) {
    // console.log(data);
    data.result.map((item) => {
      $("#state").append($("<option>").text(item.statename).val(item.stateid));
    });
  });

  ///////////////------------> City's <----------------\\\\\\\\\\\\\\\\\\

  $("#state").change(function () {
    $.getJSON(
      "http://localhost:3000/employee/fetchcitys",
      { stateid: $("#state").val() },
      function (data) {
        // console.log(data);
        $("#city").empty();
        $("#city").append($("<option>").text("Choose City..."));
        data.data.map((it) => {
          $("#city").append($("<option>").text(it.cityname).val(it.cityid));
        });
      }
    );
  });
});
