define(
		[],
		function() {
			var DigitDetector = function() {

			};

			function variance(list) {
				if (list.length == 0)
					return 0;
				var avg = average(list);
				var v = 0;
				for (var i = 0; i < list.length; ++i) {
					v += (avg - list[i]) * (avg - list[i]);
				}
				return v;
			}

			function average(list) {
				var sum = 0.0;
				for (var i = 0; i < list.length; ++i) {
					sum += list[i];
				}
				return sum / list.length;
			}
			function array_max(arr, start_index, end_index, key) {
				var max_index = start_index;
				for (var i = start_index + 1; i < end_index; ++i) {
					if (arr[max_index][key] < arr[i][key]) {
						max_index = i;
					}
				}
				return arr[max_index];
			}
			function determinant(a, b, c, d) {
				return a * d - b * c;
			}

			function intersection(horizontal_line, vertical_line, cols, rows) {
				var D = determinant(vertical_line.shear, -cols, rows,
						-horizontal_line.shear);
				var lambda = determinant(-vertical_line.shear, -cols,
						horizontal_line.top_col, -horizontal_line.shear)
						/ D;
				var mu = determinant(vertical_line.shear,
						-vertical_line.top_col, rows, horizontal_line.top_col)
						/ D;
				var x = vertical_line.top_col + lambda * vertical_line.shear;
				var y = horizontal_line.top_col + mu * horizontal_line.shear;
				// console.log("x = "+x+ " y = "+y);
				return {
					"x" : x,
					"y" : y
				};
			}
			DigitDetector.digit_corners = function(grayscale_image) {
				console.log("in digit corners!");
				var cols = grayscale_image[0].length;
				var rows = grayscale_image.length;
				if (cols < 10 || rows < 10) {
					return null;
				}
				var horizontal_lines = horizontal_digit_lines(grayscale_image);
				var vertical_lines = vertical_digit_lines(grayscale_image);
				// console.log("horizontal: "+JSON.stringify(horizontal_lines));
				// console.log("vertical: "+JSON.stringify(vertical_lines));
				var topleft = intersection(horizontal_lines[0],
						vertical_lines[0], cols, rows);
				var topright = intersection(horizontal_lines[0],
						vertical_lines[1], cols, rows);
				var bottomleft = intersection(horizontal_lines[1],
						vertical_lines[0], cols, rows);
				var bottomright = intersection(horizontal_lines[1],
						vertical_lines[1], cols, rows);
				// delete middle horizontal line
				// find intersections of other two lines
				// return those coordinates
				var result =[ topleft, topright, bottomright, bottomleft ]; 
				return result;
			};
			function horizontal_digit_lines(grayscale_image) {
				var all_variances = horizontal_variances(grayscale_image);
				var variance_peaks = get_peaks(all_variances);
				var horizontal_lines = get_horizontal_lines(grayscale_image,
						variance_peaks);
				return horizontal_lines;
			}
			function vertical_digit_lines(grayscale_image) {
				var all_variances = vertical_variances(grayscale_image);
				// console.log(JSON.stringify(all_variances));
				var variance_peaks = get_peaks(all_variances);
				// console.log(JSON.stringify(variance_peaks));
				var vertical_lines = get_vertical_lines(grayscale_image,
						variance_peaks);
				return vertical_lines;
			}
			function get_highest_vertical_luminance_lines(grayscale_image,
					peaks) {
				var all_luminances = new Array();
				for (var i = 0; i < peaks.length; ++i) {
					var shear = peaks[i].shear;
					var luminances = get_vertical_average_luminances(
							grayscale_image, shear);
					Array.prototype.push.apply(all_luminances, luminances);
				}
				all_luminances.sort(function(a, b) {
					return b.average - a.average;
				});
				return all_luminances;
			}
			function get_highest_distinct(all_luminances, amount, interval) {
				var current = [ all_luminances[0] ];
				for (var i = 1; i < all_luminances.length; ++i) {
					var good = true;
					for (var j = 0; j < current.length; ++j) {
						if (Math.abs(all_luminances[i].top_col
								- current[j].top_col) < interval) {
							good = false;
							break;
						}
					}
					if (good) {
						current.push(all_luminances[i]);
						if (current.length == amount)
							break;
					}
				}
				return current;
			}
			function get_vertical_lines(grayscale_image, peaks) {
				var INTERVAL = 5;
				var all_luminances = get_highest_vertical_luminance_lines(
						grayscale_image, peaks);
				all_luminances = get_highest_distinct(all_luminances, 2,
						INTERVAL);
				var result = null;
				if (all_luminances[0].top_col < all_luminances[1].top_col) {
					result = [ all_luminances[0], all_luminances[1] ];
				} else {
					result = [ all_luminances[1], all_luminances[0] ];
				}
				return result;
			}
			function get_horizontal_lines(grayscale_image, peaks) {
				var INTERVAL = 5;
				var transposed_image = transpose_image(grayscale_image);
				var all_luminances = get_highest_vertical_luminance_lines(
						transposed_image, peaks);
				all_luminances = get_highest_distinct(all_luminances, 3,
						INTERVAL);
				var result = [ all_luminances[0], all_luminances[1],
						all_luminances[2] ];
				var heighest = result[0];
				var lowest = result[0];
				for (var i = 1; i < 3; ++i) {
					if (result[i].top_col > heighest.top_col) {
						heighest = result[i];
					}
					if (result[i].top_col < lowest.top_col) {
						lowest = result[i];
					}
				}
				return [ lowest, heighest ];
			}
			function array_key_value(array, key) {
				var res = [];
				for (var i = 0; i < array.length; ++i) {
					res.push(array[i][key]);
				}
				return res;
			}
			function get_peaks(arr) {
				var average_variance = average(array_key_value(arr, "variance"));
				var in_high_area = false;
				var INTERVAL = 5;
				var high_area_start = -INTERVAL;
				var high_values = new Array();
				// console.log("looking for peaks in: "+JSON.stringify(arr));
				for (var i = 0; i < arr.length; ++i) {
					if (arr[i].variance > average_variance) {
						if (!in_high_area && i > high_area_start + INTERVAL) {
							in_high_area = true;
							high_area_start = i;
						}
					} else {
						if (in_high_area) {
							high_values.push(array_max(arr, high_area_start, i,
									"variance"));
							in_high_area = false;
							high_area_start = i;
						}
					}
				}
				if (in_high_area) {
					high_values.push(array_max(arr, high_area_start,
							arr.length, "variance"));
				}
				return high_values;
			}
			function get_vertical_luminance(grayscale_image, start_col, shear) {
				var rows = grayscale_image.length;
				var line_results = new Array();
				for (var row = 1; row < rows; ++row) {
					var col = start_col + shear * row / rows;
					var float_part = col - Math.floor(col);
					var value = 0;
					value += grayscale_image[row][Math.floor(col)]
							* (1 - float_part);
					value += grayscale_image[row][Math.ceil(col)] * float_part;
					line_results.push(value);
				}
				return line_results;
			}
			function get_vertical_average_luminances(grayscale_image, shear) {
				var averages = new Array();
				var cols = grayscale_image[0].length;
				for (var top_col = Math.max(-shear, 0); top_col < Math.min(
						cols, cols - shear); top_col++) {
					averages.push({
						"shear" : shear,
						"top_col" : top_col,
						"average" : average(get_vertical_luminance(
								grayscale_image, top_col, shear))
					});
				}
				return averages;
			}
			function get_vertical_average_luminances_variance(grayscale_image,
					shear) {
				var averages = get_vertical_average_luminances(grayscale_image,
						shear);
				var v = variance(array_key_value(averages, "average"))
						/ averages.length;
				return v;
			}
			function vertical_variances(grayscale_image) {
				var rows = grayscale_image.length;
				var cols = grayscale_image[0].length;
				var max_shear = 1.0 * rows;
				var shear_step = 1.0;
				var all_variances = new Array();
				for (var shear = -max_shear; shear <= max_shear; shear += shear_step) {
					var v = get_vertical_average_luminances_variance(
							grayscale_image, shear);
					if (isNaN(v))
						continue;
					all_variances.push({
						"shear" : shear,
						"variance" : v
					});
				}
				return all_variances;
			}
			function transpose_image(image) {
				var translated_image = new Array();
				for (var i = 0; i < image[0].length; ++i) {
					translated_image.push(new Array(image.length));
				}
				for (var i = 0; i < image.length; ++i) {
					for (var j = 0; j < image[i].length; ++j) {
						translated_image[j][i] = image[i][j];
					}
				}
				return translated_image;
			}
			function horizontal_variances(grayscale_image) {
				var translated_image = transpose_image(grayscale_image);
				return vertical_variances(translated_image);
			}
			return DigitDetector;
		});