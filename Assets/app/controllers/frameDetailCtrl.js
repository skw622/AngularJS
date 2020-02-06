angular.module('frameDetail', ['ui.bootstrap'])
	.controller('frameDetailCtrl', function ($scope, $stateParams, $http, urlPrefix) {
		$scope.frameId = $stateParams.frameId;
		$scope.deviceId = $stateParams.deviceId;
		$scope.categories = null;
		$scope.communicating = true;
		$scope.message = null;

		$scope.getFrameDetail = function() {
			$scope.frame = null;

			$http.get(urlPrefix + '/api/Frame-Detail?Id=' + $scope.frameId)
				.success(function (data, status, headers, config) {
					$scope.communicating = false;
					$scope.frame = data;
				}).error(function (data, status, headers, config) {
					$scope.communicating = false;
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to load frame details";
				});
		};

		$scope.getCategories = function () {
			$scope.categories = null;
			$scope.message = null;

			$http.get(urlPrefix + '/api/Category')
				.success(function (data, status, headers, config) {
					$scope.categories = data;
				}).error(function (data, status, headers, config) {
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to get categories";
				});
		};

		$scope.getImageUrl = function (blob) {
			return urlPrefix + "/api/Frame-Sprite?deviceId=" + $scope.deviceId + "&frameId=" + $scope.frameId + "&blobIndex=" + blob.BlobIndex + "&imageFormat=" + $scope.frame.ImageFormat;
		};

		$scope.getRawFrameUrl = function () {
			return urlPrefix + "/api/Frame-RawImage?deviceId=" + $scope.deviceId + "&frameId=" + $scope.frameId + "&imageFormat=" + $scope.frame.ImageFormat;
		};

		$scope.catSelect = function (blob, blobcat) {
			var probability = window.prompt("Probability (0-1)", blobcat.Probability);
			if (probability !== null) {
				var p = parseFloat(probability);
				$scope.communicating = true;
				$scope.message = null;
				$http.put(urlPrefix + '/api/Frame-BlobCategory', { FrameId: $scope.frameId, BlobIndex: blob.BlobIndex, CategoryCode: blobcat.CategoryCode, Probability: p })
					.success(function (data, status, headers, config) {
						$scope.communicating = false;
						if (p === 0)
							blob.Categories.splice(blob.Categories.indexOf(blobcat), 1);
						else
							blobcat.Probability = p;
						$scope.otherEntry = null;
					}).error(function (data, status, headers, config) {
						$scope.communicating = false;
						$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to set device mode";
					});
			}
		};

		$scope.otherSelect = function (blob, category) {
			var probability = window.prompt("Probability (0-1)", "1");
			if (probability !== null) {
				var p = parseFloat(probability);
				if (p > 0) {
					$scope.communicating = true;
					$scope.message = null;
					$http.put(urlPrefix + '/api/Frame-BlobCategory', { FrameId: $scope.frameId, BlobIndex: blob.BlobIndex, CategoryCode: category.Code, Probability: p })
						.success(function (data, status, headers, config) {
							$scope.communicating = false;
							blob.Categories.push({ CategoryCode: category.Code, CategoryDescription: category.Description, Probability: p });
						}).error(function (data, status, headers, config) {
							$scope.communicating = false;
							$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to set device mode";
						});
				}
			}
		};

		$scope.startsWith = function (actual, expected) {
			var lowerStr = (actual + "").toLowerCase();
			return lowerStr.indexOf(expected.toLowerCase()) === 0;
		};

		$scope.getFrameDetail();
		$scope.getCategories();
	})

	.directive('spriteimage', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('load', function () {
					var height = element[0].height;
					var width = element[0].width;
					var imageHeight = scope.blob.Height;
					var cellHeight = imageHeight > 0 ? imageHeight : height / 16;
					element.css({ height: height + "px", width: width + "px" });
					element.parent().css({ height: cellHeight + "px", width: width + "px" });
					
					var y = 0;
					var animation = setInterval(function () {
						element.css({ top: y + "px" });
						y -= cellHeight;
						if (y <= -height) {
							y = 0;
						}
					}, 100);
				});
			}
		};
	});