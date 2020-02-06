angular.module('adminDevices', [])
	.controller('adminDevicesCtrl', function ($scope, $http, urlPrefix) {

		//$scope.$on('refresh', new function (e, entities) {
		//	if ('Provision' in entities)
		//		$scope.getList();
		//});

		$scope.getList = function() {
			$http.get(urlPrefix + '/api/Device-Admin')
				.success(function (data, status, headers, config) {
					$scope.deviceList = data;
				});
		};

		$scope.beginGenerate = function () {
			$scope.newDevice = {};
			$scope.password = null;

			$http.get(urlPrefix + '/api/Device-GenerateID')
				.success(function (data, status, headers, config) {
					$scope.newDevice.Id = data;
				});
		}

		$scope.saveNewDevice = function () {
			$scope.password = null;
			$http.post(urlPrefix + '/api/Device', $scope.newDevice)
				.success(function (data, status, headers, config) {
					$scope.message = null;
					$scope.newDevice = null;
					$scope.getList();
					$scope.password = data
				})
				.error(function (data, status, headers, config) {
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to generate device";
				});
		}
		//$scope.disable = function(index)
		//{
		//	$http.post(urlPrefix + '/api/Device/Disable/' + $scope.deviceList[index].id)
		//		.success(function (data, status, headers, config) {
		//			$scope.getList();
		//		});
		//}

		//Get the current user's list when the page loads.
		$scope.newDevice = null;
		$scope.getList();
	});