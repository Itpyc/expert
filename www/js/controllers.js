angular.module('starter.controllers', ['highcharts-ng'])
  .controller('TabCtrl', function ($scope, $http, $rootScope, $ionicPopup, $timeout, $state, WenZhenMsgHandler) {
    //用户登录成功后
    $rootScope.socket = io.connect('http://192.168.0.22:3001');
    var confirmPopup = null;
    $rootScope.showWenZhenInfo = false;
    $rootScope.badgeCount = '';
    $scope.showConfirm = function () {
      confirmPopup = $ionicPopup.confirm({
        title: '接受到视频问诊请求',
        template: "<div>是否立即前往处理</div><div style='text-align: center;margin-top: 20px;color: red'>剩余时间：{{leftTime}}</div>",
        cancelText: '待会',
        okText: '马上'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          $state.go('tab.msgs', {wz: '1'}); //前往消息中心
        } else {
          console.log('You are not sure');
        }
      });
    };
    $rootScope.socket.on('wenzhenMsg', function (msg) { //收到问诊消息
      console.log('收到问诊消息')
      WenZhenMsgHandler.initStatus(); //初始化状态
      $scope.showConfirm(); //打开确定提示框
      WenZhenMsgHandler.startTimer(confirmPopup); //启动定时器
      WenZhenMsgHandler.setWzMsg(msg); //保存问诊消息
      $rootScope.wenzhenInfo = msg;
    });
  })
  .controller('LoginCtrl', function ($scope, Auth, $http, $state) {
    //用户点击登录
    $scope.login = function () {
      //获取用户名和密码
      Auth.setToken('testToken');
      console.log(Auth.getToken());
      //登录成功后，返回值  token  id  userInfo ,均保存到本地
      $state.go('tab.home');

    };
  })
  .controller('HomeCtrl', function ($scope, $state, $ionicModal) {
    $scope.goAppointPage = function () {
      $state.go('tab.appointment');
    };
    $scope.goToTeachOnline = function () {
      $state.go('tab.teachOnline');
    };
    $scope.goToRecord = function () {
      $state.go('tab.record');
    };
    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
    //状态设置
    $scope.statuslist = [{
      text: '在线',
      value: '1'
    },
      {
        text: '忙碌',
        value: '2'
      },
      {
        text: '离线',
        value: '3'
      }
    ];

    $scope.selectedStatus = {
      selected: '1'
    };
    $scope.serverlist = [
      {text: "图文咨询", checked: true, icon: 'ion-ios-chatbubble-outline'},
      {text: "视频服务", checked: false, icon: 'ion-ios-videocam-outline'},
      {text: "电话咨询", checked: false, icon: 'ion-android-call'},
      {text: '问诊服务', checked: false, icon: 'ion-ios-medkit-outline'},
      {text: '预约服务', checked: false, icon: 'ion-ios-timer-outline'}
    ];
    $scope.status = {
      text: '在线',
      checked: true,
    };
  })
  .controller('MsgCtrl', function ($scope, $state, $rootScope, $interval, WenZhenMsgHandler, $stateParams, $http,ZXMsg) {
    $scope.goToDetail = function (userId) {
      console.log(userId);
      $state.go('tab.zixun',{userId:userId});
    };
    //进入房间,从后台获取消息列表
    $scope.$on('$ionicView.enter', function () {
      console.log($stateParams.wz);
      //从后台获取咨询消息列表
      $http({
        url: 'http://192.168.0.22:3001/zxlist',
        method: 'get'
      }).success(function (data) {
        $scope.messages = data.messages;
        ZXMsg.init($scope.messages);
      }).error(function () {
      });
  /*    $scope.messages=  ZXMsg.init();
      console.log($scope.messages)*/
      var wzStatus = $stateParams.wz;
      if (wzStatus === '1') { //如果是从问诊提示的popup中来的
        $rootScope.showWenZhenInfo = true;
        console.log($scope.wenzhenInfo)
        console.log($rootScope.showWenZhenInfo)
      }
    });
    $scope.activeNumber = 1;
    $scope.refuseWz = function () { //拒绝
      WenZhenMsgHandler.cancleTimer();
      /*   $interval.cancel($scope.timer);*/
      WenZhenMsgHandler.resetMsg();
      //通知后台拒绝了
      $rootScope.socket.emit('refuseWz', {
        msg: '拒绝了'
      });
    }
    $scope.acceptWZ = function () {
      //接受问诊，通知后台
      $rootScope.socket.emit('acceptWz', {
        msg: '接受了'
      });
      //通知后台发起消息
      WenZhenMsgHandler.cancleTimer();
      /*   $interval.cancel($scope.timer);*/
      WenZhenMsgHandler.resetMsg();
      $state.go('tab.wenzhen');
    };

    /**
     * 咨询
     */
    //咨询消息列表
    //先从后台获取到

    /*    $rootScope.socket.on('zxMsg_get', function (data) {
     if(data.code === 1){
     $scope.zx_list.push(data)
     }
     });*/
  })
  .controller('WZCtrl', function ($scope, $ionicModal, $ionicPopover, $ionicHistory, $rootScope, WZData, $http) {
    $ionicHistory.removeBackView();

    //进入问诊界面之后。锁定。
    //获取病人信息

    //监听视频问诊消息
    $ionicModal.fromTemplateUrl('bingli-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.Bmodal = modal;
    });
    $ionicModal.fromTemplateUrl('x-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.Xmodal = modal;
    });
    $ionicModal.fromTemplateUrl('result-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.Rmodal = modal;
    });
    //查询病人详细信息
    //获取病人信息
    //   $scope.patientDetailInfo = DataStore.getPatientInfo();
    console.log($scope.patientDetailInfo);
    WZData.init($scope); //初始化治疗参数
    $scope.submitHZResult = function () {
      console.log($scope.selectedData);
      //构建json串
      if ($scope.selectedData.choseValue == "yes") { //医生选择为适应症
        console.log($scope.ciCorner_chosed)
        var tempArr1 = [];
        for (var k = 0; k < $scope.sickPlace.length; k++) {
          var temp1 = $scope.sickPlace;
          if (temp1[k].checked == true) {
            tempArr1.push(temp1[k].id);
          }
        }
        $scope.HZResult = {
          status: '3',
          expertAdvice: '3',
          /*   eci: {*/
          'eci.addUser': localStorage.getItem('token'),
          'eci.askId': $rootScope.askId,
          'eci.illPart': tempArr1.toString(), //病变部位
          'eci.illDeviation': $scope.selectedData.sickDir, //病变偏向
          'eci.illDegree': $scope.selectedData.sickLevel, //病变程度
          'eci.ciDistance': $scope.selectedData.ciDistance_chosed,
          'eci.ciAngulation': $scope.selectedData.ciAngulation_chosed,
          'eci.ciAlternateCorner': $scope.selectedData.ciCorner_chosed,
          /*   'eci.userIdCard': $scope.patientDetailInfo.userIdCard,
           'eci.askUserId': $scope.patientDetailInfo.addUser*/
          /*        },*/

        };
        console.log($scope.HZResult);
      } else if ($scope.selectedData.choseValue === "refuse") { //医生选择为拒绝治疗
        var tempArr = [];
        for (var i = 0; i < $scope.jjzList.length; i++) {
          var temp = $scope.jjzList;
          if (temp[i].checked == true) {
            tempArr.push(temp[i].value);
          }
        }
        $scope.HZResult = {
          expertAdvice: '1',
          status: '4',
          'eci.addUser': localStorage.getItem('token'),
          'eci.askId': $rootScope.askId,
          /* 'eci.userIdCard': $scope.patientDetailInfo.userIdCard,
           'eci.askUserId': $scope.patientDetailInfo.addUser,*/
          forbidReason: tempArr.toString()
        };
      } else {
        $scope.HZResult = {
          expertAdvice: '2',
          status: '4',
          'eci.addUser': localStorage.getItem('token'),
          'eci.askId': $rootScope.askId,
          /*      'eci.userIdCard': $scope.patientDetailInfo.userIdCard,
           'eci.askUserId': $scope.patientDetailInfo.addUser*/
        };
      }
      console.log($scope.HZResult);
      //设置等待动画
      //向后台提交治疗参数
      $http({
        url: 'http://localhost:3001/hzResult',
        method: 'get',
        params: $scope.HZResult
      }).success(function (data) {
        console.log(data);
      }).error(function (err) {
        console.log(err);
      });
    }
  })
  .controller('ZXCtrl', function ($scope, $rootScope, $ionicScrollDelegate,ZXMsg,$stateParams,$timeout) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.data = {};
    $scope.messageDetails = ZXMsg.getMessageById($stateParams.userId).message;
    console.log($scope.messageDetails);
    $scope.sendMessage = function () {
      $scope.messageDetails.push({
        isFromeMe: true,
        content: $scope.data.send_content,
        time: new Date().toLocaleTimeString()
      });
      console.log(ZXMsg.getMessageById($stateParams.userId))
      //向后台发送消息
      $rootScope.socket.emit('zxMsg', {
        isFromeMe: true,
        content: $scope.data.send_content,
        time: new Date().toLocaleTimeString(),
        to: ''
      });
      $scope.data = {};
    };
    //监听后台获取到的消息
    $rootScope.socket.on('zxMsg', function (data) {
      $timeout(function () {
        viewScroll.scrollBottom();
      },0)
      $scope.messageDetails.push(data);
    });
  })
  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })
  .controller('OfficeCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })
  .controller('SettingCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })
  .controller('AppointmentCtrl', function ($scope) {
    $scope.activeNumber = 1;
  })
  .controller('RecordCtrl', function ($scope) {
    var chart = {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    };
    var title = {
      text: '治疗类型'
    };
    var tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    };
    var plotOptions = {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    };

    var credits = {
      enabled: false
    };

    var series = [{
      type: 'pie',
      name: '比例',
      data: [
        ['图文咨询', 45.0],
        ['电话咨询', 26.8],
        {
          name: '视频问诊',
          y: 12.8,
          sliced: true,
          selected: true
        },
        ['视频会诊', 8.5]
      ]
    }];

    var json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.series = series;
    json.plotOptions = plotOptions;
    json.credits = credits;
    $scope.chartConfig = json;


    $scope.activeNumber = 1;
  })
  .controller('TeachCtrl', function ($scope) {

    /*    navigator.getUserMedia ||
     (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);

     navigator.getUserMedia({
     video: true,
     audio: true
     }, function (stream) {
     var video = document.getElementById('localVideo');
     video.src = URL.createObjectURL(stream);
     $scope.videoSrc = video.src;
     console.log(stream)
     }, function (err) {
     console.log(err);
     });*/
  })
  .controller('EduVBCtrl', function ($scope, $ionicModal) {
    navigator.getUserMedia ||
    (navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);
    $scope.startB = function () {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, function (stream) {
        var video = document.getElementById('localVideo');
        video.src = URL.createObjectURL(stream);
        $scope.videoSrc = video.src;
        console.log(stream)
      }, function (err) {
        console.log(err);
      });
    }

    $scope.slideData = [{
      id: 0,
      content: ''
    }, {
      id: 1,
      content: ''
    }, {
      id: 1,
      content: ''
    }, {
      id: 1,
      content: ''
    }, {
      id: 1,
      content: ''
    }, {
      id: 1,
      content: ''
    }, {
      id: 1,
      content: ''
    }];
    $ionicModal.fromTemplateUrl('ready-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.getReady = function () {
      $scope.modal.show();
    }

    $scope.handleFiles = function (files) {
      console.log(files)
      var reader = new FileReader();
      //读取文件过程方法
      reader.onloadstart = function (e) {
        console.log("开始读取....");
      }
      reader.onprogress = function (e) {
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      reader.readAsDataURL(files[0])
      reader.onload = function (e) {
        var img = document.createElement('img');
        img.visibility = 'hidden';
        img.src = e.target.result;
        var c = document.getElementById("myCanvas1");
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0)
      }

    }
  })
  .controller('EduRCtrl', function ($scope) {

  })
  .controller('EduPCtrl', function ($scope) {

  })
  .controller('EduHCtrl', function ($scope) {

  });
