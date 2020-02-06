angular.module('examineBrowse', ['utcToLocal'])
	.controller('examineBrowseCtrl', function ($scope, $stateParams, $http, urlPrefix) {
		$scope.deviceId = $stateParams.deviceId;
		$scope.endingDateTime = new Date();
		$scope.startingDateTime = null;
		$scope.navigateValue = $scope.endingDateTime;

		$scope.getFrames = function() {
			$scope.frames = null;

			var date = $scope.endingDateTime ? $scope.endingDateTime : $scope.startingDateTime;
			var dateString = date.toISOString();
			var dateQuery = $scope.endingDateTime ? 'ending=' + dateString : 'starting=' + dateString;

			$http.get(urlPrefix + '/api/Frame?deviceId=' + $scope.deviceId + '&' + dateQuery)
				.success(function (data, status, headers, config) {
					$scope.frames = $scope.endingDateTime || !data ? data : data.reverse();
					$scope.navigateValue = $scope.frames && $scope.frames.length > 0
						? $scope.parseAsUtc($scope.frames[0].CollectedAt)
						: date;
				});
		};

		$scope.parseAsUtc = function(value) {
			return new Date(value + 'Z');
		};

		$scope.navigateTo = function (value) {
			$scope.endingDateTime = value || new Date();
			$scope.startingDateTime = null;
			$scope.getFrames();
		};

		$scope.prior = function () {
			if ($scope.frames && $scope.frames.length > 0) {
				$scope.startingDateTime = null;
				$scope.endingDateTime = $scope.parseAsUtc($scope.frames[$scope.frames.length - 1].CollectedAt);
				$scope.getFrames();
			}
			else {
				var time = $scope.endingDateTime || $scope.startingDateTime;
				if (time) {
					$scope.startingDateTime = null;
					$scope.endingDateTime = time;
					$scope.getFrames();
				}
				else {
					$scope.frames = [];
				}
			}
		};

		$scope.next = function () {
			if ($scope.frames && $scope.frames.length > 0) {
				$scope.startingDateTime = $scope.parseAsUtc($scope.frames[0].CollectedAt);
				$scope.endingDateTime = null;
				$scope.getFrames();
			}
			else {
				var time = $scope.startingDateTime || $scope.endingDateTime;
				if (time) {
					$scope.startingDateTime = time;
					$scope.endingDateTime = null;
					$scope.getFrames();
				}
				else {
					$scope.frames = [];
				}
			}
		};

		//Get the entries starting at the given Date and Time
		$scope.getFrames();
	});