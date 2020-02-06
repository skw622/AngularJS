angular.module('device', [])
	.controller('deviceCtrl', function ($scope, $http, $state, $rootScope, urlPrefix) {
		$rootScope.$state = $state;

		$scope.getStatus = function () {
			//$http.get(urlPrefix + '/api/Device/Status')
			//	.success(function (data, status, headers, config) {
			//		$scope.deviceStatus = data;
			//	});
		};

		//Get the device's status
		$scope.getStatus();
	});