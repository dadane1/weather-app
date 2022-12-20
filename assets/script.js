const apiKey = "4e1783108ba73c75a0ed73882acd3356";
            let city;
            let allCities = [];
            $(document).ready(() => {
                if (localStorage.getItem("cityName") != null) {
                    allCities = JSON.parse(localStorage.getItem("cityName"));
                    console.log(allCities);
                    createCityButton();
                }
            });

            function createCityButton() {
                $("#newCity").empty();
                for (allCity of allCities) {
                    console.log(allCity);
                    let b = $("<li>").addClass("list-group-item btn btn-light search").text(allCity).attr("value", allCity);
                    $("#newCity").append(b);
                }
            }

            $(document).on("click", ".search", function () {
                city = $("#searchCity").val();
                let searchCity = $(this).val();
                if (city != "" && !allCities.includes(city)) {
                    allCities.push(city);
                    localStorage.setItem("cityName", JSON.stringify(allCities));
                    createCityButton();
                } else {
                    console.log("this is clicking");
                    city = $(this).text();
                }
                $("#searchCity").val("");
                showData(city);
            });

            function showData(city) {
                $("#fiveDaysWeather").empty();
                fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&q=${city}`)
                    .then((response) => response.json())
                    .then((data) => {
                        $("#cityName").text(data.city.name);
                        let d = new Date();
                        $("#todayDate").text(d.toDateString());

                        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&appid=${apiKey}`)
                            .then((response) => response.json())
                            .then((data) => {
                                let img = $("<img>").attr("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                                $("#weatherIcon").html(img);
                                $("#weatherTemp").text(Math.round(1.8 * (data.main.temp - 273.15) + 32));
                                $("#weatherWind").text(data.wind.speed);
                                $("#weatherHumid").text(data.main.humidity);
                            });

                        for (let i = 0; i < data.list.length; i += 8) {
                            let t = data.list[i];
                            let a = $("<div>").addClass("col-2");
                            let b = $("<div>").html(t.dt_txt);
                            let c = $("<img>").attr("src", `http://openweathermap.org/img/wn/${t.weather[0].icon}@2x.png`);
                            let d = $("<div>").html("Temp: " + Math.round(1.8 * (t.main.temp - 273.15) + 32) + "&deg;F");
                            let e = $("<div>").html("Wind: " + t.wind.speed + " MPH");
                            let f = $("<div>").html("Humid: " + t.main.humidity + "%");
                            a.append(b).append(c).append(d).append(e).append(f);
                            $("#fiveDaysWeather").append(a);
                        }
                    });
            }

            showData("Austin");