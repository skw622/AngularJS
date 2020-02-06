angular.module('examineQuery', ['utcToLocal'])
	.controller('examineQueryCtrl', function ($scope, $stateParams, $http, $httpParamSerializer, urlPrefix) {
		$scope.deviceId = $stateParams.deviceId;
		$scope.query = 'select B.FrameId, B.BlobIndex from Blob B join Frame F on F.Id = B.FrameId where F.CollectedAt between _ and _';

		$scope.getResults = function() {
			$scope.blobs = null;

			$http.get(urlPrefix + '/api/Frame-RawBlobs', { params: { 'query': $scope.query, 'deviceId': $scope.deviceId } })
				.success(function (data, status, headers, config) {
					$scope.blobs = data;
				})
				.error(function (data, status, headers, config) {
				});
		};

		$scope.getImageUrl = function (blob) {
			return urlPrefix + "/api/Frame-Sprite?deviceId=" + $scope.deviceId + "&frameId=" + blob.FrameId + "&blobIndex=" + blob.BlobIndex + "&imageFormat=" + blob.ImageFormat;
		};

		$scope.getDownloadUrl = function () {
			var provider = $httpParamSerializer;
			var url = urlPrefix + '/api/Frame-RawDownload?' + provider({ 'query': $scope.query, 'deviceId': $scope.deviceId });
			return url;
		};


	});