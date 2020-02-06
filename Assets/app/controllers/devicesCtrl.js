angular.module('devices', [])
	.controller('devicesCtrl', function ($scope, $http, urlPrefix) {

		$scope.$on('refreshData', new function (e, entities) {
			if (e && entities && 'Provision' in entities)
				$scope.getList();
		});

		$scope.getList = function () {
			$http.get(urlPrefix + '/api/Device-User')
				.success(function (data, status, headers, config) {
					$scope.deviceList = data;
				});
		};

		//$scope.disable = function(index)
		//{
		//	$http.post(urlPrefix + '/api/Device/Disable/' + $scope.deviceList[index].id)
		//		.success(function (data, status, headers, config) {
		//			$scope.getList();
		//		});
		//}

		//Get the current user's list when the page loads.
		$scope.getList();
	});