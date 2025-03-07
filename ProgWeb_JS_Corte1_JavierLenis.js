/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|~~~~~~~°
|	UNIVERSIDAD LIBRE SECCIONAL CALI			 |~~~~~~~~~~~~°
|	INGENIERÍA DE SISTEMAS						 |~~~~~~~°
|	PROGRAMACIÓN WEB							 |~~~~~~~~~~~~~~~~~~~~~°
|	PARCIAL CORTE #1							 |~~~~~~~~~~~~~~°
|	ESTUDIANTE: Javier Camilo Lenis Grisales	 |~~~~~~~~~°
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	
		google.charts.load('current', {'packages':['corechart']});


		// Función para generar gráfico con Google Chart
        function drawChart(xValues, yValues) {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'X');
            data.addColumn('number', 'Y');

            for (let i = 0; i < xValues.length; i++) {
                data.addRow([parseFloat(xValues[i]), parseFloat(yValues[i])]);
            }

            var options = {
                title: 'GRÁFICO LINEAL',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
            chart.draw(data, options);
        }


		// Cálculo de la ecuación
        function calcularEcuacion(a, b, c, d, e, xMin, xMax) {
            let xValues = [];
            let yValues = [];
            let minY = Infinity;
            let maxY = -Infinity;
            let minX = xMin;
            let maxX = xMax;
            let zeroCrossings = [];


            // Generar valores de X y calcular Y
            for (let x = xMin; x <= xMax; x += 0.1) {
                if (x === 0) continue; // Evitar división por cero

                let y = (a * Math.sin(x) + b * Math.cos(x) + c * Math.sqrt(Math.abs(x)) + d / x + e) / (Math.cos(x) * Math.sin(x));

                if (isNaN(y)) continue; // Evitar valores NaN

                xValues.push(x.toFixed(2));
                yValues.push(y.toFixed(2));

                if (y < minY) minY = y;
                if (y > maxY) maxY = y;

                // Detectar cortes en el eje Y (cortes en cero)
                if (xValues.length > 1 && ((yValues[yValues.length - 2] > 0 && y < 0) || (yValues[yValues.length - 2] < 0 && y > 0))) {
                    zeroCrossings.push(x.toFixed(2));
                }
            }

            return { xValues, yValues, minY, maxY, minX, maxX, zeroCrossings };
        }

		
		// Procesamiento del cálculo de la ecuación y algunas validaciones necesarias
        function process() {
            let a = document.getElementById("a").value;
            let b = document.getElementById("b").value;
            let c = document.getElementById("c").value;
            let d = document.getElementById("d").value;
            let e = document.getElementById("e").value;
            let xMin = document.getElementById("xMin").value;
            let xMax = document.getElementById("xMax").value;


            // Validaciones para entrada de valores no válidos que no sean numéricos
            let regex = /^-?\d+(\.\d+)?$/;

            if (!regex.test(a) || !regex.test(b) || !regex.test(c) || !regex.test(d) || !regex.test(e) || !regex.test(xMin) || !regex.test(xMax)) {
                document.getElementById("error").innerText = "¡Ingresaste un valor no válido o dejaste alguna casilla en blanco! \n Revisa lo que ingresaste y pon más atención...";
                document.getElementById("xTable").innerHTML = "";
				document.getElementById("yTable").innerHTML = "";
				document.getElementById("zeroCrossingsTable").innerHTML = "";
				document.getElementById("curve_chart").innerHTML = "";
				document.getElementById("minY").innerText = "";
				document.getElementById("maxY").innerText = "";
				document.getElementById("minX").innerText = "";
				document.getElementById("maxX").innerText = "";
				document.getElementById("zeroCrossings").innerText = "";
				return;
            } else {
                document.getElementById("error").innerText = "";
            }
			

			// Parsear los valores
            a = parseFloat(a);
            b = parseFloat(b);
            c = parseFloat(c);
            d = parseFloat(d);
            e = parseFloat(e);
            xMin = parseFloat(xMin);
            xMax = parseFloat(xMax);

            let result = calcularEcuacion(a, b, c, d, e, xMin, xMax);

            document.getElementById("minY").innerText = "Valor mínimo de Y: " + result.minY;
            document.getElementById("maxY").innerText = "Valor máximo de Y: " + result.maxY;
            document.getElementById("minX").innerText = "Valor mínimo de X: " + result.minX;
            document.getElementById("maxX").innerText = "Valor máximo de X: " + result.maxX;
            document.getElementById("zeroCrossings").innerText = "Cantidad de cortes detectados: " + result.zeroCrossings.length;


			// Validación para cuando el valor mínimo o máximo de "Y" sea infinito o -infinito
			if (!isFinite(result.minY) || !isFinite(result.maxY)) {
				if (!isFinite(result.minY)) {
				document.getElementById("minY").style.color = "red";
				document.getElementById("minY").innerText = `El valor mínimo de Y es ${result.minY > 0 ? 'infinito' : '-infinito'}`;
			}
			if (!isFinite(result.maxY)) {
				document.getElementById("maxY").style.color = "red";
				document.getElementById("maxY").innerText = `El valor máximo de Y es ${result.maxY > 0 ? 'infinito' : '-infinito'}`;
			}
			document.getElementById("xTable").innerHTML = "";
			document.getElementById("yTable").innerHTML = "";
			document.getElementById("zeroCrossingsTable").innerHTML = "";
			document.getElementById("curve_chart").innerHTML = "";
			document.getElementById("minX").innerText = "";
			document.getElementById("maxX").innerText = "";
			document.getElementById("zeroCrossings").innerText = "";
			} else {
				document.getElementById("minY").style.color = "black";
				document.getElementById("minY").innerText = `Valor mínimo de Y: ${result.minY}`;
				document.getElementById("maxY").style.color = "black";
				document.getElementById("maxY").innerText = `Valor máximo de Y: ${result.maxY}`;
				document.getElementById("minX").innerText = `Valor mínimo de X: ${result.minX}`;
				document.getElementById("maxX").innerText = `Valor máximo de X: ${result.maxX}`;
    
				// Mostrar tabla de cortes detectados
				displayZeroCrossings(result.zeroCrossings);

				// Mostrar tablas
				displayTables(result.xValues, result.yValues);

				// Dibujar gráfico
				drawChart(result.xValues, result.yValues);
			}
			
			
			// Validación para cuando no haya ningún recorte detectado; no se mostrará la tabla de recortes
			if (result.zeroCrossings.length === 0) {
				document.getElementById("zeroCrossingsTable").innerHTML = "";
			} else {
				displayZeroCrossings(result.zeroCrossings);
			}
		}

		
		// Generar tablas
        function displayTables(xValues, yValues) {
            let xTable = document.getElementById("xTable");
            let yTable = document.getElementById("yTable");

            xTable.innerHTML = "<tr><th>Valores de X</th></tr>";
            yTable.innerHTML = "<tr><th>Valores de Y</th></tr>";

            for (let i = 0; i < xValues.length; i++) {
                xTable.innerHTML += "<tr><td>" + xValues[i] + "</td></tr>";
                yTable.innerHTML += "<tr><td>" + yValues[i] + "</td></tr>";
            }
        }

		
		// Cortes detectados
        function displayZeroCrossings(zeroCrossings) {
            let zeroCrossingsTable = document.getElementById("zeroCrossingsTable");

            zeroCrossingsTable.innerHTML = "<tr><th>Cortes Detectados</th></tr>";
            for (let i = 0; i < zeroCrossings.length; i++) {
                zeroCrossingsTable.innerHTML += "<tr><td>" + zeroCrossings[i] + "</td></tr>";
            }
        }