angular.module('adminAccounts', [])
	.controller('adminAccountsCtrl', function ($scope, $http, urlPrefix) {

		//$scope.$on('refresh', new function (e, entities) {
		//	if ('Provision' in entities)
		//		$scope.getList();
		//});

		$scope.getList = function () {
			$http.get(urlPrefix + '/api/Account-Admin')
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