angular.module('analyze', [])
	.controller('analyzeCtrl', function ($scope, $http, $stateParams, $filter, urlPrefix) {

		$scope.filter = { "categories": ["POL", "MOL", "INO"] };

		$scope.rawData = null;
		$scope.data = null;

		$scope.periods = { 
			"day" :  { name: "day", interval: "hour", count: 24, label: "Day", labelEvery: 1 },
			"week": { name: "week", interval: "hour", count: 168, label: "Week", labelEvery: 6 },
			"month": { name: "month", interval: "day", count: 31, label: "Month", labelEvery: 2 },
			"quarter": { name: "quarter", interval: "day", count: 92, label: "Quarter", labelEvery: 7 },
			"year": { name: "year", interval: "week", count: 52, label: "Year", labelEvery: 4 }
		};

		$scope.toUTCString = function (date) {
			return $filter('date')(date, 'yyyy-MM-ddTHH:mm:ss.sss', 'UTC') + 'Z';
		};

		function toLocalDate(dateStr, format) {
			if (!dateStr) {
				return;
			}

			// append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
			if (dateStr.indexOf('Z') === -1 && dateStr.indexOf('+') === -1) {
				dateStr += 'Z';
			}
			return new Date(dateStr);
		}

		function toLocalString(dateStr, format) {
			return dateStr ? $filter('date')(toLocalDate(dateStr), format) : undefined;
		}

		function toShortDateString(dateStr) {
			return toLocalString(dateStr, 'MMM-d');
		}

		$scope.day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		const millisecondsPerDay = 60 * 60 * 1000 * 24;

		$scope.floorHour = function (date) {
			var msph = 60 * 60 * 1000; // milliseconds in an hour
			return new Date(Math.floor(date.getTime() / msph) * msph);
		};

		function floorDay(date) {
			return new Date(Math.floor(date.getTime() / millisecondsPerDay) * millisecondsPerDay);
		}

		function deltaDate(input, hours, days, months, years) {
			var date = new Date(input);
			date.setHours(date.getHours() + hours);
			date.setDate(date.getDate() + days);
			date.setMonth(date.getMonth() + months);
			date.setFullYear(date.getFullYear() + years);
			return date;
		}

		$scope.ending = $scope.floorHour(new Date());

		$scope.getStarting = function () {
			var count = -$scope.selectedPeriod.count;
			var period = $scope.selectedPeriod.interval;
			return deltaDate(
				$scope.ending,
				(period === "hour" ? 1 : 0) * count,
				(period === "day" ? 1 : period === "week" ? 7 : 0) * count,
				(period === "month" ? 1 : period === "quarter" ? 3 : 0) * count,
				(period === "year" ? 1 : 0) * count
			);
		};

		function getDateLabels(moments, every) {
			var result = [];
			for (var i = 0; i < moments.length; ++i) {
				result.push(i % every === 0 ? toShortDateString(moments[i]) : "");
			}
			return result;
		}

		function getHourLabels(moments, every) {
			var result = [];
			for (var i = 0; i < moments.length; ++i) {
				var date = toLocalDate(moments[i]);
				var hours = date.getHours();
				var month = date.getMonth();
				var day = date.getDate();
				result.push(
					i % every === 0
						? (moments.length > 24 ? (month + 1).toString() + "/" + day.toString() + " " : "") + (hours.toString() + ":00")
						: ""
				);
			}
			return result;
		}

		function getLabels(moments) {
			var every = $scope.selectedPeriod.labelEvery;
			switch ($scope.selectedPeriod.interval) {
				case "hour": return getHourLabels(moments, every);
				case "day":
				case "week":
				case "quarter":
				case "year": return getDateLabels(moments, every);
			}
		}

		$scope.transformResults = function (data) {
			var filteredCategories = data.Categories.filter(function (c) { return $scope.filter.categories.indexOf(c.CategoryCode) >= 0; });
			return {
				"Labels": getLabels(data.Moments),

				"Data":
					data.Categories.length === 0
						? [[]]
						: filteredCategories.map(function (category) { return category.PPM3; }),

				"Series":
					data.Categories.length === 0
						? []
						: filteredCategories.map(function (category) { return category.CategoryDescription; }),

				"Categories":
					data.Categories

			};
		};

		function addHours(d, h) {
			var date = new Date(d);
			date.setHours(date.getHours() + h);
			return date;
		}

		$scope.getDefaultData = function () {
			return {
				"Labels": function () {
					var starting = $scope.ending;
					var result = [];
					for (var i = 0; i < 24; ++i) {
						result.push(addHours(starting, -i).toISOString());
					}
					return result;
				}(),

				"Data": [
					Array(24).fill(0)
				],

				"Series": [],

				"Categories": []
			};
		};

		function getTableData() {
			result = [];
			for (var s = 0; s < $scope.data.Series.length; ++s) {
				for (var i = 0; i < $scope.data.Labels.length; ++i) {
					var point = $scope.data.Data[s][i];
					if (point) {
						result.push({ Description: $scope.data.Series[s], DateTime: $scope.data.Labels[i], PPM3: point });
					}
				}
			}
			$scope.tableData = result;
		}

		function getChartData() {
			$scope.chartData = null;
		}

		$scope.modes = {
			chart: { title: 'Chart', generator: getChartData },
			table: { title: 'Table', generator: getTableData }
		};
		
		$scope.selectMode = function (mode) {
			$scope.selectedMode = mode;
		};

		$scope.localRefresh = function () {
			$scope.data = $scope.rawData ? $scope.transformResults($scope.rawData) : null;
		};

		$scope.$watch('rawData', $scope.localRefresh);
		$scope.$watch('filter.categories', $scope.localRefresh, true);

		$scope.getData = function () {
			$scope.rawData = null;

			$http.get(urlPrefix + "/api/Rollup-Default/" + $stateParams.deviceId, {
				params: {
					starting: $scope.toUTCString(new Date($scope.getStarting())),
					ending: $scope.toUTCString($scope.ending),
					interval: $scope.selectedPeriod.interval
				}
			})
				.success(function (data, status, headers, config) {
					$scope.rawData = data;
				})

				.error(function (data, status, headers, config) {
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to load data";

					$scope.rawData = $scope.getDefaultData();
				})
				.finally(function () {
					$scope.selectedMode.generator();
				});

		};

		$scope.selectPeriod = function (period) {
			$scope.selectedPeriod = period;
			if ($stateParams.deviceId)
				$scope.getData();
		};

		$scope.navigateTo = function (ending) {
			$scope.ending = $scope.floorHour(ending);
			if ($stateParams.deviceId)
				$scope.getData();
		};

		$scope.ending = $scope.floorHour(new Date());
		$scope.selectMode($scope.modes[$stateParams.mode]);
		$scope.selectPeriod($scope.periods[$stateParams.period]);
	});