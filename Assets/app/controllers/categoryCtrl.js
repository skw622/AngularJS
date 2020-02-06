angular.module('category', ['chart.js'])
	.controller('categoryCtrl', function ($scope, $http, $stateParams, urlPrefix) {
		$scope.code = $stateParams.code;
		$scope.selected = {
			"Region": {
				"Geography": { "type": "MultiPolygon", "coordinates": [[[]]], "crs": { "type": "name", "properties": { "name": "EPSG:4326" } } }
			}
		};
		function dayOfYear(d) {
			var now = new Date();
			var start = new Date(now.getFullYear(), 0, 0);
			var diff = now - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var day = Math.floor(diff / oneDay);
			alert(day);
		};
		$scope.factors = {
			Data: function () {
				var r = [];
				for (var i = 0; i < 365; ++i) {
					r.push(0);
				}
				return [ r ];
			}(),
			Labels: function () {
				var months = { 0: "Jan", 31: "Feb", 59: "Mar", 90: "Apr", 120: "May", 151: "Jun", 181: "Jul", 212: "Aug", 243: "Sep", 273: "Oct", 304: "Nov", 334: "Dec" };
				var r = [];
				for (var i = 0; i < 365; ++i) {
					r.push(months[i] || "");
				}
				return r;
			}()
		};
		$scope.map = { center: { longitude: -111.58156369999999, latitude: 40.113394 } };

		$scope.getCategory = function () {
			$http.get(urlPrefix + '/api/Category/' + $scope.code)
				.success(function (data, status, headers, config) {
					$scope.category = data;
				});
		};

		$scope.addSegment = function () {
			$scope.newSegment = {};
		};

		$scope.saveSegment = function () {
			if ($scope.category.Segments) {
				$scope.category.Segments.push($scope.newSegment);
			}
			else {
				$scope.category.Segments = [$scope.newSegment];
			}
			$scope.newSegment = null;
			$scope.dirty = true;
		};

		function GetCentroid(paths){
			var f;
			var x = 0;
			var y = 0;
			var nPts = paths.length;
			var j = nPts-1;
			var area = 0;

			for (var i = 0; i < nPts; j=i++) {   
				var pt1 = paths[i];
				var pt2 = paths[j];
				f = pt1[1] * pt2[0] - pt2[1] * pt1[0];
				x += (pt1[1] + pt2[1]) * f;
				y += (pt1[0] + pt2[0]) * f;

				area += pt1[1] * pt2[0];
				area -= pt1[0] * pt2[1];        
			}
			area /= 2;
			f = area * 6;
			return { latitude: x/f, longitude: y/f };
		}

		function AvgCentroids(centroids) {
			var sum = { latitude: centroids[0].latitude, longitude: centroids[0].longitude };
			for (var i = 1; i < centroids.length; ++i) {
				sum.latitude += centroids[i].latitude;
				sum.longitude += centroids[i].longitude;
			}
			return { latitude: sum.latitude / centroids.length, longitude: sum.longitude / centroids.length }
		}
		
		$scope.selectSegment = function (segment) {
			$scope.selected = segment;
			var coords = $scope.selected.Region.Geography.coordinates[0];
			$scope.map.center = $scope.selected.Region.Geography.type === "MultiPolygon" ? AvgCentroids(coords.map(GetCentroid)) : GetCentroid(coords);

			var r = [];
			for (var i = 0; i < segment.Factors.length; ++i) {
				r[segment.Factors[i].OrdinalDate] = segment.Factors[i].Probability;
			}
			for (var i = 0; i < 365; ++i) {
				if (!(i in r)) {
					r[i] = 0;
				}
			}
			return $scope.factors.Data = [r];
		};

		$scope.loadTypes = function () {
			if (!$scope.types) {
				$http.get(urlPrefix + '/api/CategoryType')
					.success(function (data, status, headers, config) {
						$scope.types = data;
					})
					.error(function (data, status, headers, config) {
						$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to load category types.";
					});
			}
		};

		$scope.setType = function (type) {
			$scope.category.TypeCode = type.Code;
			$scope.category.TypeDescription = type.Description;
			$scope.dirty = true;
		};

		$scope.getRegions = function () {
			$http.get(urlPrefix + '/api/Region')
				.success(function (data, status, headers, config) {
					$scope.regions = data;
				});
		};

		$scope.regionSelected = function (region) {
			$scope.newSegment.RegionId = region.Id;
			$scope.newSegment.Region = region;
		};

		$scope.removeSegment = function (segment) {
			$scope.category.Segments.splice($scope.category.Segments.indexOf(segment), 1);
			$scope.dirty = true;
		};

		$scope.getCategory();
		$scope.getRegions();
	});