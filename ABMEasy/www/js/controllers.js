angular.module('abmeasy.controllers', [])

.controller('SignInCtrl', function($scope, $http, $state, $ionicPopup, $ionicLoading, UrlManager) {
  $scope.signIn = function(user) {
  // var token_url = "https://learndev.vch.ca/m2/vch_custom/016_app/logging_in.php";
  // $state.go('app.home');
  

    if (user && user.username && user.password) {

      if(user.username == '' || user.password == '') {
          $ionicPopup.alert({
          title: 'Login error',
          template: 'Please input username and password'
        })();
      }

      //Show Loading
      $ionicLoading.show({
        template: 'Loading...'
      });

      var loginUrl = UrlManager.get('login');
      $http.post(loginUrl, {'username': user.username, 'password': user.password, 'remember': 1})
      .success(function(result) {
        console.log(result);
        if(result.status == 'success')
        {
          $ionicLoading.hide();
          $state.go('app.home');
        }
        if(result.status == 'error')
        {
          $ionicLoading.hide();
          $scope.showAlert = function() {
          var alertPopup = $ionicPopup.alert({
              title: 'Login error',
              template: '<p style="text-align:center;">The username or password you entered is incorrect.</p>'
            });
          }();
        }
      })
      .error(function(result) {
        $ionicLoading.hide();
        console.log(result);
        //if log is not accepted
        $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Login error',
            template: '<p style="text-align:center;">The username or password you entered is incorrect.</p>'
          });
        }();
      });

    } else {
      $ionicPopup.alert({
        title: 'Login error',
        template: '<p style="text-align:center;">Please input username and password.</p>'
      });
    }


  };

  $scope.signup = function() {
    $state.go('app.signup');
  };
    
})

.controller('SignUpCtrl', function($scope, $http, $state, $ionicPopup, $ionicLoading, UrlManager) {
  
  $scope.signup = function(user) {
  // var token_url = "https://learndev.vch.ca/m2/vch_custom/016_app/logging_in.php";
  // $state.go('app.home');
    if(validateUserSignup(user)) {
      $ionicLoading.show({
        template: 'Signing up...'
      });

      $http.get(UrlManager.get('gettoken'))
      .success(function(result) {
        var userData = {
          username : user.username,
          password : user.password,
          first_name : user.fname,
          last_name : user.lname,
          email : user.email,
          phone : "",
          password_confirmation : user.confirmpassword,
          bookkeeping_features : user.usebookkeeping == true ? 1 : 0,
          tax_features : user.usetax == true ? 1 : 0,
          _token : result,
          Accept : user.terms == true ? 1 : 0
        };
        
        if(user.phone) {
          userData.phone = user.phone;
        }

        $http.post(UrlManager.get('signup'), userData)
        .success(function(result) {
          $ionicLoading.hide();


          console.info("success");
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: '<p style="text-align:center;">You have been created a new account.</p>'
          });
        })
        .error(function(result) {
          $ionicLoading.hide();
          console.info("error");

          var alertPopup = $ionicPopup.alert({
            title: 'Signup Error',
            template: '<p style="text-align:center;">Invalid request, Please try again...</p>'
          });
        });
      })
      .error(function(result) {
        $ionicLoading.hide();

        $scope.items = [];
        var alertPopup = $ionicPopup.alert({
          title: 'Error occured',
          template: '<p style="text-align:center;">Invalid request, Please try again...</p>'
        });
      });
    };
  };

  var validateUserSignup = function(user) {
    var validate = true;
    if (!user) {
      $ionicPopup.alert({
        title: 'Input error',
        template: '<p style="text-align:center;">Please input required fields.</p>'
      });
      validate = false;
    }
    else if( (!user.username || user.username=='') || 
      (!user.fname || user.fname=='') ||
      (!user.lname || user.lname=='') ||
      (!user.email || user.email=='') ||
      (!user.password || user.password=='') ||
      (!user.confirmpassword || user.confirmpassword==''))
    {
      $ionicPopup.alert({
        title: 'Input error',
        template: '<p style="text-align:center;">Please input required fields.</p>'
      });
      validate = false;
    }

    if (validate) {
      validate = validateEmailAddress(user.email);
    }

    if (validate) {
      validate = validatePassword(user.password, user.confirmpassword);
    }

    if (validate) {
      if(!user.terms) {
        validate = false
        $ionicPopup.alert({
          title: 'Agree Terms',
          template: '<p style="text-align:center;">You have to agree on Terms of Use.</p>'
        });
      }
      else
        validate = true
    }

    if (validate && user.phone) {
      validate = validatePhoneNumber(user.phone);
    }

    return validate;
  };

  var validateEmailAddress = function(email) {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)){
      return true; 
    }
    else{
      $ionicPopup.alert({
        title: 'Email error',
        template: '<p style="text-align:center;">Please input email address correctly.</p>'
      });
      return false;
    }
  }

  var validatePassword = function(password, confirmpassword) {
    if(password === confirmpassword) 
      return true;
    else {
      $ionicPopup.alert({
        title: 'Password error',
        template: '<p style="text-align:center;">Please input password correctly.</p>'
      });
      return false; 
    }
  }

  var validatePhoneNumber = function(phonenumber) {
    var reg = /^\d*$/;
    if (reg.test(phonenumber)) {
      return true;
    } 
    else {
      $ionicPopup.alert({
        title: 'Phone Number error',
        template: '<p style="text-align:center;">Please input Phone number correctly.</p>'
      });
      return false;
    }
  }

  $scope.onTerms = function() {
    $state.go('app.terms');
  }


})

.controller('HomeCtrl', function($scope, $state, $ionicPlatform, $ionicHistory) {
    $ionicHistory.clearHistory();
    $scope.onUploadTax = function() {
      $state.go('app.uploadtax');
    };

    $scope.onUploadReceipt = function() {
      $state.go('app.receiptimage');
    };

    // $ionicPlatform.registerBackButtonAction(function () {
    //   var exitPopup = $ionicPopup.show({
    //     template: '<p style="text-align:center;"> Would you like to exit app? </p>',
    //     title: 'Exit ABMEasy',
    //     scope: $scope,
    //     buttons: [
    //       { text: 'No' },
    //       {
    //         text: '<b>Yes</b>',
    //         type: 'button-assertive',
    //         onTap: function(e) {
    //           navigator.app.exitApp();
    //         }
    //       }
    //     ]
    //   });
    //   exitPopup.then(function(res) {
    //     console.log('Tapped!', res);
    //   });

    // }, 100);
})

.controller('UpdTaxDocCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading, UrlManager, DocTypeInfo) {
  $scope.imgTax = null;
  var pictureSource;
  var destinationType; // sets the format of returned value

  $scope.onChooseImage = function() {
      
      ionic.Platform.ready(function() {
        //console.log("ready get camera types");
        if (!navigator.camera)
        {
          $ionicPopup.alert({
            title: 'Camera Error',
            template: '<p style="text-align:center;">Please check your camera...</p>'
          });
          detectError = true;
          return;
        }

        pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
        onSubmitImage();
      });
    };

    $scope.onTakePhoto = function() {
      ionic.Platform.ready(function() {
        //console.log("ready get camera types");
        if (!navigator.camera)
        {
          $ionicPopup.alert({
            title: 'Camera Error',
            template: '<p style="text-align:center;">Please check your camera...</p>'
          });
          detectError = true;
          return;
        }

        pictureSource=navigator.camera.PictureSourceType.CAMERA;
        onSubmitImage();
      });
    };

  var onSubmitImage = function() {
    var detectError = false;
    var options =   {
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: pictureSource,
    };
    if (detectError) return;


    navigator.camera.getPicture(
      function (imageURI) {
        //console.log("got camera success ", imageURI);
        $scope.imgTax = imageURI;
        UploadTax();
      },
      function (err) {
        $scope.imgTax = null;
      },
      options);
  };

  var UploadTax = function() {
    DocTypeInfo.set('file', $scope.imgTax);

    $ionicLoading.show({
      template: 'Get Tax document token...'
    });

    $http.get(UrlManager.get('taxdoc'))
    .success(function(result) {
      $ionicLoading.hide();
      DocTypeInfo.set('application_id', result.data[0].id);
      console.info("ApplicationID = " + result.data[0].id);

      $state.go( 'app.choosetype', {requesttype:'tax'} ); 
    })
    .error(function(result) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Error occured',
        template: '<p style="text-align:center;">Please check your internet connection.</p>'
      });
      detectError = true;
    }); 
  };
})

.controller('ReceiptImageCtrl', function($scope, $state, $http, $ionicPopup, UrlManager, DocTypeInfo) {
  var pictureSource;   // picture source
  var destinationType; // sets the format of returned value
  var url;
  var detectError = false;

  $scope.onChooseImage = function() {
    ionic.Platform.ready(function() {
      //console.log("ready get camera types");
      if (!navigator.camera)
      {
        $ionicPopup.alert({
          title: 'Camera Error',
          template: '<p style="text-align:center;">Please check your camera...</p>'
        });
        detectError = true;
      }

      pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
      onSubmitReceiptImage();
    });
  };

  $scope.onTakePhoto = function() {
    ionic.Platform.ready(function() {
      //console.log("ready get camera types");
      if (!navigator.camera)
      {
        $ionicPopup.alert({
          title: 'Camera Error',
          template: '<p style="text-align:center;">Please check your camera...</p>'
        });
        detectError = true;
      }

      pictureSource=navigator.camera.PictureSourceType.CAMERA;
      onSubmitReceiptImage();
    });
  };

  var onSubmitReceiptImage = function() {
    destinationType=navigator.camera.DestinationType.FILE_URI;

    var options =   {
      quality: 50,
      destinationType: destinationType,
      sourceType: pictureSource,
    };

    if(detectError) return;

    navigator.camera.getPicture(
      function (imageURI) {
        DocTypeInfo.set('file', imageURI);
        $state.go( 'app.uploadreceipt'); 
      },
      function (err) {
        DocTypeInfo.set('file', null);
      },
    options);
  };

})

.controller('UpdReceiptDocCtrl', function($scope, $state, $http, $ionicPopup, UrlManager, DocTypeInfo) {

  $scope.UploadReceipt = function(receipt) {
    // if (this.CheckValidReceipt(receipt)) {
      // file, subtotal, gst, pst, type(tid)

      var receiptData = this.CheckValidReceipt(receipt);
      DocTypeInfo.set('subtotal', receiptData.subtotal);
      DocTypeInfo.set('gst', receiptData.gst);
      DocTypeInfo.set('pst', receiptData.pst);
      $state.go( 'app.choosetype', {requesttype:'receipt'} ); 
    // }
    // else {
      // $ionicPopup.alert({
        // title: 'Input error',
        // template: '<p style="text-align:center;">Please input the values correctly.</p>'
      // });
    // }

  };

  $scope.CheckValidReceipt = function(receipt) {
    if(!receipt) {
      receipt = {}
      receipt.subtotal = '';
      receipt.gst = '';
      receipt.pst = '';
      return receipt;
    }

    if(!receipt.subtotal) receipt.subtotal = '';
    if(!receipt.gst) receipt.gst = '';
    if(!receipt.pst) receipt.pst = '';

    return receipt;
  }
})

.controller('ChooseTypeCtrl', function($scope, $state, $ionicNavBarDelegate, $http, $ionicLoading, $ionicPopup, UrlManager, DocTypeInfo) {

  var docTypeUrl;
  if ($state.params.requesttype == 'tax') {
    $ionicLoading.show({
      template: 'Getting Tax Types...'
    });

    $scope.title = "Please choose Tax types";
    $scope.uploadBtnTitle = "Upload Tax";
    docTypeUrl = UrlManager.get('taxdoctype');

  } else if ($state.params.requesttype == 'receipt') {
    $ionicLoading.show({
      template: 'Getting Receipt Types...'
    });

    $scope.title = "Please choose Receipt types";
    $scope.uploadBtnTitle = "Upload Receipt";
    docTypeUrl = UrlManager.get('expensetype');
  }
  
  $http.get(docTypeUrl)
  .success(function(result) {
    $ionicLoading.hide();
    $scope.items = result;
  })
  .error(function(result) {
    $ionicLoading.hide();
    $scope.items = [];
    var alertPopup = $ionicPopup.alert({
      title: 'Error occured',
      template: '<p style="text-align:center;">Please check your internet connection.</p>'
    });
  });

  $scope.onSetDocType = function(docTypeStr) {
    var docType = JSON.parse(docTypeStr);
    if ($state.params.requesttype == 'tax') {
      DocTypeInfo.set('category', docType.cid);
      DocTypeInfo.set('type', docType.tid);

    } else if($state.params.requesttype == 'receipt') {
      DocTypeInfo.set('type', docType.tid);
    }
  };
  
  $scope.onUpload = function() {

    var uploadUrl;

    if ($state.params.requesttype == 'tax') {
      uploadUrl = UrlManager.get('uploadtax');
    } else if($state.params.requesttype == 'receipt') {
      uploadUrl = UrlManager.get('uploadreceipt');
    }

    $ionicLoading.show({
      template: 'Please wait...'
    });

    $http.get(UrlManager.get('gettoken'))
    .success(function(result) {
      // $ionicLoading.hide();
      DocTypeInfo.set('_token', result);
      $http.post(uploadUrl, DocTypeInfo.all())
      .success(function(result) {
        $ionicLoading.hide();


        console.info("success");
        $state.go('app.success');
        // $ionicHistory.clearHistory();
        // $state.go('app.success');
      })
      .error(function(result) {
        $ionicLoading.hide();
        console.info("error");

        var alertPopup = $ionicPopup.alert({
          title: 'Error occured',
          template: '<p style="text-align:center;">Failed to upload. Please try again...</p>'
        });
      });
    })
    .error(function(result) {
      $ionicLoading.hide();

      $scope.items = [];
      var alertPopup = $ionicPopup.alert({
        title: 'Error occured',
        template: '<p style="text-align:center;">Invalid request, Please try again...</p>'
      });
    });
    // $state.go('app.success');
  };
})

.controller('SuccessCtrl', function($scope, $state, $http, $ionicHistory, UrlManager) {
  $ionicHistory.clearHistory();
  $scope.onStartOver = function() {
    $ionicHistory.clearHistory();
    $state.go('app.home');
  };

  $scope.onLogout = function() {
    $ionicHistory.clearHistory();
    $state.go('app.login');
  };
})




