angular.module('preview', [])
	.controller('previewCtrl', function ($scope, $http, $stateParams, $filter, $controller) {

		$controller('analyzeCtrl', { $scope: $scope });

	});