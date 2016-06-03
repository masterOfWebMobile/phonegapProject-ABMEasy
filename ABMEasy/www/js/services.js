angular.module('abmeasy.services', [])

.factory('UrlManager', function() {
  
  var urls = [
    { id:0, name: 'login',          url: 'https://abmeasy.com/app/ajax/login' }, 
    { id:1, name: 'taxdoctype',     url: 'https://abmeasy.com/app/ajax/get-tax-doc-types' }, 
    { id:2, name: 'taxdoc',         url: 'https://abmeasy.com/app/ajax/get-tax-doc' }, 
    { id:3, name: 'uploadtax',      url: 'https://abmeasy.com/app/ajax/upload-tax-document' }, 
    { id:4, name: 'expensetype',    url: 'https://abmeasy.com/app/ajax/get-expense-types' }, 
    { id:5, name: 'uploadreceipt',  url: 'https://abmeasy.com/app/ajax/upload-receipt' },
    { id:6, name: 'gettoken',       url: 'https://abmeasy.com/app/ajax/get-token' },
    { id:7, name: 'signup',         url: 'https://abmeasy.com/app/ajax/signup'}
  ];


  return {
    all: function() {
      return urls;
    },
    get: function(urlname) {
      for (var i = 0; i < urls.length; i++) {
        if (urls[i].name == urlname) {
          return urls[i].url;
        }
      }
      return null;
    }
  }
})

.factory('DocTypeInfo', function() {
  var receiptDocInfo = {};
  return {
    all: function() {
      return receiptDocInfo;
    },
    set: function(key, value) {
      receiptDocInfo[key] = value;
    }
  }
})

;
