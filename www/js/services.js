angular.module('starter.services', [])
  .factory('Locals', function ($window) {
    return {        //存储单个属性
      set: function (key, value) {
        $window.localStorage[key] = value;
      },        //读取单个属性
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },        //存储对象，以JSON格式存储
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },        //读取对象
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      remove: function (key) {
        localStorage.removeItem(key);
      }

    }
  })
  .factory('Auth', function (Locals) {
    //用户登录信息
    var userInfo = Locals.getObject('userInfo') || {};
    var id = Locals.get('id') || {};
    var token = Locals.get('token') || {};
    console.log(token);
    return {
      setUserInfo: function (value) {//保存用户信息
        userInfo = value;
        Locals.set('userInfo', value);
      },
      getUserInfo: function () {//获取用户信息
        return userInfo;
      },
      updateUserInfo: function (value) {//更新用户信息
        userInfo = value;
        Locals.setObject('userInfo', value);
      },
      setToken: function (value) {
        token = value;
        Locals.set('token', value);
      },
      getToken: function (value) {
        return token;
      },
      logout: function () {
        Locals.remove('token');
        token = null;
      }
    }
  })
  .factory('spineRtc', function () {

    return {
      getUserMedia: function () {
        return navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      }

    }
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array
    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

  .factory('PatientInfo', function () {
    var patientInfo = {};
    return {
      getPatientInfo: function () {
        return patientInfo;
      },
      setPatientInfo: function (data) {
        patientInfo = data;
      }
    }
  })
  .factory('WenZhenMsgHandler', function ($interval, $rootScope) {
    var wzMsg;
    return {
      startTimer: function (confirmPopup) {
        //开启一个定时器
        $rootScope.timer = $interval(function () {
          // console.log($rootScope.leftTime)
          if ($rootScope.leftTime <= 0) {//定时时间到，关闭定时器
            confirmPopup.close();
            confirmPopup = null;
            $interval.cancel($rootScope.timer);
            //隐藏信息
            $rootScope.showWenZhenInfo = false;
            //去掉badge
            $rootScope.badgeCount = '';
            //重置时间
            $rootScope.leftTime = '300';
            //清空
            $rootScope.wenzhenInfo = {};
          } else {
            $rootScope.leftTime -= 1;
          }
        }, 100);
      },
      cancleTimer: function () {
        $interval.cancel($rootScope.timer);
      },
      setWzMsg: function (data) {
        wzMsg = data;
        console.log(data)
      },
      getWzMsg: function () {
        return wzMsg;
      },
      initStatus: function () {
        //隐藏信息
        $rootScope.showWenZhenInfo = true;
        //去掉badge
        $rootScope.badgeCount = '1';
        //重置时间
        $rootScope.leftTime = '300';
      },
      resetMsg: function () {//重置状态
        //隐藏信息
        $rootScope.showWenZhenInfo = false;
        //去掉badge
        $rootScope.badgeCount = '';
        //重置时间
        $rootScope.leftTime = '300';
        //清空
        $rootScope.wenzhenInfo = {};
      }
    }
  })
  .factory('WZData', function ($ionicPopover) {
    return {
      init: function ($scope) {
        $scope.ciDistance_all = ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'];
        //成角
        $scope.ciAngulation_all = ['3', '2', '1', '0', '-1', '-2', '-3'];
        //转角
        $scope.ciCorner_all = ['3', '2', '1', '0', '-1', '-2', '-3'];
        //诊治结果
        $scope.clientSideList = [
          {text: "适应症，可以继续治疗", value: "yes"},
          {text: "非适应症，建议继续检查", value: "reCheck"},
          {text: "禁忌症，无法治疗", value: "refuse"}
        ];
        /*     $scope.data = {
         choseValue: 'refuse'
         };*/
        //禁忌症列表
        $scope.jjzList = [
          {text: "脊柱结核、脊柱肿瘤、脊柱感染等病变者", checked: false, "value": '1'},
          {text: "严重突出超过椎管容积50%、游离型椎间盘脱出者", checked: false, "value": '2'},
          {text: "合并心、脑血管、肝、肾、造血系统、内分泌系统等严重原发性疾病及精神病患者", checked: false, "value": '3'},
          {text: "腰椎间盘手术后有植入物者及先天性脊柱异常者", checked: false, "value": '4'},
          {
            text: "孕妇及产褥期妇女;",
            checked: false, "value": '5'
          },
          {text: "强直性脊柱炎及风湿性、类风湿性关节炎的患者", checked: false, "value": '6'},
          {
            text: "有骨质疏松症的患者",
            checked: false, "value": '7'
          }
        ];
        /*病变部位*/
        $scope.sickPlace = [
          {id: 1, text: 'T1/2', checked: false},
          {id: 2, text: 'T2/3', checked: false}, {
            id: 3,
            text: 'T3/4',
            checked: false
          }, {
            id: 4,
            text: 'T4/5',
            checked: false
          }, {id: 5, text: 'T5/6', checked: false},
          {id: 6, text: 'T6/7', checked: false}, {
            id: 7,
            text: 'T7/8',
            checked: false
          }, {id: 8, text: 'T9/10', checked: false}, {
            id: 9,
            text: 'T11/12',
            checked: false
          }, {id: 10, text: 'T12/L1', checked: false},
          {id: 11, text: 'L1/2', checked: false}, {
            id: 12,
            text: 'L2/3',
            checked: false
          },
          {id: 13, text: 'L3/4', checked: false},
          {
            id: 14,
            text: 'L4/5',
            checked: false
          },
          {id: 15, text: 'L5/S1', checked: false}
        ];
        //病变偏向
        $scope.sickDirs = [
          {'key': '偏左', 'value': '1'},
          {'key': '偏右', 'value': '2'}
        ];
        //病变程度
        $scope.sickLevels = [
          {'key': '轻', 'value': '2'},
          {'key': '中', 'value': '5'},
          {'key': '重', 'value': '8'}
        ];

        $scope.openSickPlacePop = function ($event) {
          console.log($scope.ciCorner_chosed)
          $scope.sickPlaceChosed = '';
          $scope.popover.show($event);
        };
        //$scope.myActiveSlide = 1;
        $ionicPopover.fromTemplateUrl('select-popover.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
        });

        $scope.$on('popover.hidden', function () {
          // 执行代码
          for (var i = 0; i < $scope.sickPlace.length; i++) {
            var temp = $scope.sickPlace;
            if (temp[i].checked === true) {
              console.log(temp[i].text);
              if (i < temp.length) {
                $scope.sickPlaceChosed += temp[i].text + ',';
              } else {
                $scope.sickPlaceChosed += temp[i].text + '';
              }
            }
          }
          console.log($scope.sickPlaceChosed)
        });
        //选中的值
        $scope.selectedData = {
          choseValue: 'refuse',
          ciDistance_chosed: $scope.ciDistance_all[4],
          ciAngulation_chosed: '0',
          ciCorner_chosed: '0',
          sickPlaceChosed: '未选择',
          sickDir: $scope.sickDirs[0],
          sickLevel: $scope.sickLevels[0]
          /*  ZJFS:$scope.ZJFSs[1]*/
        };


      }
    }
  })
  .factory('ZXMsg', function ($http) {
    var data = [];
    return {
      init: function (msg) {
        data=msg;
      },
      getAllMessage:function () {
        return data;
      },
      getMessageById: function (userId) {
        console.log(userId);
        for (var i in data) {
          console.log(data[i].id)
          if (data[i].id == userId) {
            console.log(data[i])
            return data[i];
          }
        }
      },
      updateMessage:function (id,message) {
        for (var i in data) {
          if (data[i].id == id) {
           data[i].message.push(message);
          }
        }
        console.log(data[0].message)

      }
    }
  })
  .factory('localStorageService', [function () {
    return {
      get: function localStorageServiceGet(key, defaultValue) {
        var stored = localStorage.getItem(key);
        try {
          stored = angular.fromJson(stored);
        } catch (error) {
          stored = null;
        }
        if (defaultValue && stored === null) {
          stored = defaultValue;
        }
        return stored;
      },
      update: function localStorageServiceUpdate(key, value) {
        if (value) {
          localStorage.setItem(key, angular.toJson(value));
        }
      },
      clear: function localStorageServiceClear(key) {
        localStorage.removeItem(key);
      }
    };
  }])
  .directive('hideTabs', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function () {
          scope.$watch(attributes.hideTabs, function (value) {
            $rootScope.hideTabs = value;
          });
        });
        scope.$on('$ionicView.beforeLeave', function () {
          $rootScope.hideTabs = false;
        });
      }
    }
  })
  .directive('input', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        'returnClose': '=',
        'onReturn': '&',
        'onFocus': '&',
        'onBlur': '&'
      },
      link: function (scope, element, attr) {
        element.bind('focus', function (e) {
          if (scope.onFocus) {
            $timeout(function () {
              scope.onFocus();
            });
          }
        });
        element.bind('blur', function (e) {
          if (scope.onBlur) {
            $timeout(function () {
              scope.onBlur();
            });
          }
        });
        element.bind('keydown', function (e) {
          if (e.which == 13) {
            if (scope.returnClose) element[0].blur();
            if (scope.onReturn) {
              $timeout(function () {
                scope.onReturn();
              });
            }
          }
        });
      }
    }
  });
