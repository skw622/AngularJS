angular.module('previewMap', [])
	.controller('previewMapCtrl', function ($scope, $http, $controller, $state, urlPrefix) {

		$controller('analyzeCtrl', { $scope: $scope });

		$scope.deviceMarkers = [];

		$scope.getDevices = function () {
			$scope.publicDevices = [];

			$http.get(urlPrefix + '/api/DeviceProvisioning/')
				.success(function (data, status, headers, config) {
					$scope.deviceList = data;
					$scope.deviceMarkers = getMarkers(data);
				})
				.error(function (data, status, headers, config) {

				});
		}();

		function getMarkers(devices) {
			return devices.map(device => ({
				coords: {
					latitude: device.Latitude,
					longitude: device.Longitude
				},
				idKey: device.DeviceId,
				options: {
					clickable: true,
					draggable: false,
					labelContent: device.DeviceId
				}
			}));
		}

		$scope.map = {
			center: {
				latitude: 39.8282,
				longitude: -98.5795
			},
			zoom: 3
		};

		$scope.changeState = function (marker) {
			$state.go('preview.analyze', { deviceId: parseInt(this.title) });
		};

});