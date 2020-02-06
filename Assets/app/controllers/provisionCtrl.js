angular.module('provision', [])
	.controller('provisionCtrl',[function ($scope, $http, $rootScope, $window, $state, urlPrefix) {
		$scope.supportsGeo = $window.navigator;
		$scope.newProvision = {};

		$scope.save = function()
		{
			$scope.message = null;
			if ($scope.newProvision.DeviceID != '') {
				$http.post(urlPrefix + '/api/DeviceProvisioning', $scope.newProvision)
					.success(function (data, status, headers, config) {
						$scope.newProvision = {};
						$rootScope.$broadcast('refreshData', { 'Provision': null, 'Device': null });
						$state.go('devices.provisionimages');
					})
					.error(function (data, status, headers, config) {
						$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to provision device";
					});
			}
		}

		activate();

		function activate() {
			$window.navigator.geolocation.getCurrentPosition(
				function (position) {
					$scope.$apply(function () {
						var coords = position.coords;
						$scope.newProvision.Latitude = coords.latitude;
						$scope.newProvision.Longitude = coords.longitude;
						$scope.newProvision.Altitude = coords.altitude;
					});
				}, function (error) {
					$scope.$apply(function () {
						$scope.message = error.message;
					});
				},
				{ enabledHighAccuracy: true, maximumAge: 60000 }
			);
		}

	}]);