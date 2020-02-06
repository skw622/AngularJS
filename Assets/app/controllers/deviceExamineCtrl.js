angular.module('deviceExamine', ['utcToLocal'])
	.controller('deviceExamineCtrl', function ($scope, $stateParams, $http, $filter) {
		$scope.deviceId = $stateParams.deviceId;

		$scope.modes = [
			{ Label: "Browse", State: "device.examine.browse.unselected" },
			{ Label: "Query", State: "device.examine.query" },
		];

	});