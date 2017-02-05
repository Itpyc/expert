// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, Locals, $state, $location, $ionicHistory) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        //物理返回按钮控制&双击退出应用
        //之前出现的问题，写了一个service，绑定了registerBackButtonAction，造成冲突
        $ionicPlatform.registerBackButtonAction(function(e) {
            //当医生选择接诊后，无法进行后退操作，必须提交结果后方可。
            if ($location.path() == '/tab/msgs/wenzhen') {
                $ionicPopup.alert({
                    title: '无法离开',
                    template: '您未提交诊断结果，无法离开此页面！'
                })
            } else if ($location.path() == '/tab/home' || $location.path() == '/tab/msgs' || $location.path() == '/login' || $location.path() == '/tab/settings') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    //退出程序时保存
                    /*  var personInfo = PersonInfoService.getPersoInfo();
                      localStorage.setItem('personInfo', JSON.stringify(personInfo));*/
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    /*  $cordovaToast.showShortBottom('再按一次退出系统');*/
                    setTimeout(function() {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            } else if ($ionicHistory.backView()) {
                /* if ($cordovaKeyboard.isVisible()) {
                   $cordovaKeyboard.close();
                 } else {*/
                $ionicHistory.goBack();
                /*     }*/
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                /*   $cordovaToast.showShortBottom('再按一次退出系统');*/
                setTimeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            //进入jiezhen界面时，需要判断是否已经选择了接诊，如果选择了则进入会诊界面
            console.log("从视图" + fromState.name + "跳转到视图" + toState.name);
            var token = Locals.get('token');
            console.log(token);
            if (toState.name == 'login') return; // 如果是进入登录界面则允许
            if (!token) {
                event.preventDefault(); // 取消默认跳转行为
                $state.go("login"); //跳转到登录界面
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $ionicConfigProvider.tabs.position("bottom");
        $stateProvider
        // setup an abstract state for the tabs directive
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabCtrl'
            })
            // Each tab has its own nav history stack:
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.appointment', {
                url: '/home/appointment',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/appointment.html',
                        controller: 'AppointmentCtrl'
                    }
                }
            })
            .state('tab.record', {
                url: "/home/record",
                views: {
                    'tab-home': {
                        templateUrl: 'templates/record.html',
                        controller: 'RecordCtrl'
                    }
                }
            })
            .state('tab.teachOnline', {
                url: '/home/teachOnline',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/teachOnline.html',
                        controller: 'TeachCtrl'
                    }
                }
            })
            .state('tab.eduVB', {
                url: '/home/eduVB',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/onlineEdu/eduVideoBrodcast.html',
                        controller: 'EduVBCtrl'
                    }
                }
            })
            .state('tab.eduRecord', {
                url: '/home/eduRecord',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/onlineEdu/eduRecord.html',
                        controller: 'EduRCtrl'
                    }
                }
            })
            .state('tab.eduPaper', {
                url: '/home/eduPaper',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/onlineEdu/eduPaper.html',
                        controller: 'EduPCtrl'
                    }
                }
            })
            .state('tab.eduHistory', {
                url: '/home/eduHistory',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/onlineEdu/eduHistory.html',
                        controller: 'EduHCtrl'
                    }
                }
            })
            .state('tab.msgs', {
                url: '/msgs',
                views: {
                    'tab-msgs': {
                        templateUrl: 'templates/tab-msg.html',
                        controller: 'MsgCtrl'
                    }
                },
                params: {
                    wz: ''
                }
            })
            .state('tab.wenzhen', {
                url: '/msgs/wenzhen',
                views: {
                    'tab-msgs': {
                        templateUrl: 'templates/news/wenzhen.html',
                        controller: "WZCtrl"
                    }
                }
            })
            .state('tab.zixun', {
                url: '/msgs/zixun/:userId',
                views: {
                    'tab-msgs': {
                        templateUrl: 'templates/news/zixun.html',
                        controller: "ZXCtrl"
                    }
                }
            })

        .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })
            .state('tab.office', {
                url: '/office',
                views: {
                    'tab-office': {
                        templateUrl: 'templates/tab-office.html',
                        controller: 'OfficeCtrl'
                    }
                }
            })
            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');
    });
