angular.module('provisionImages', [ 'ui.router' ])
	.controller('provisionImagesCtrl',['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {

		$scope.save = function() {
			$scope.message = null;
		}
	}]);