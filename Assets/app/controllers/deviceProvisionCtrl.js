angular.module('deviceProvision', [])
	.controller('deviceProvisionCtrl', function ($scope, $http, $stateParams, urlPrefix) {
		$scope.deviceId = $stateParams.deviceId;
		$scope.message = null;
		$scope.map = { "options": { "clickable": "false", "title": $scope.deviceId } };

		$scope.getProvisioning = function () {
			$scope.provisionings = null;
			$http.get(urlPrefix + '/api/DeviceProvisioning/' + $scope.deviceId)
				.success(function (data, status, headers, config) {
					$scope.provisioning = data;
					$scope.map.center = { latitude: data.Latitude, longitude: data.Longitude };
					$scope.map.zoom = 12;
				})
				.error(function (data, status, headers, config) {
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to unprovision device";
				});
		};

		$scope.unprovision = function () {
			$scope.unprovisionInitiated = false;
			$scope.unprovisioning = true;
			$scope.message = null;
			$http.delete(urlPrefix + '/api/DeviceProvisioning/' + $scope.deviceId)
				.success(function (data, status, headers, config) {
					$scope.unprovisioning = false;
				})
				.error(function (data, status, headers, config) {
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to unprovision device";
					$scope.unprovisioning = false;
				});

		};

		//Get the device's status
		$scope.getProvisioning();
	});