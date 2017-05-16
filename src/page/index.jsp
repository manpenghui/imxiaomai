<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style type="text/css">
 *{
    margin: 0px;
    padding: 0px;
 }   
html{
    width: 100%;
    height: 100%;
}
body{
    width: 100%;
    height: 100%;
}
</style>
</head>

<body>
  <div style="width: 100%;height: 100%"> 
      <img style="width: 100%;height: 100%;" src="/html5/static/images/welcome.png">
  </div>
  
</body>
<script src="/html5/static/js/store.min.js"></script>
<script src="/html5/static/js/jquery.min.js"></script>
<script type="text/javascript">
    store.clear();
    var data = ${jsonObject};
    console.log(data);
    data.openId = data.openid;
    store.set("user", JSON.stringify(data));
    store.set("position","");
    store.set("userInfo","");
    //console.log(JSON.parse(store.get('user')))
    var succesFunc = function(res) {
        store.set("bannerList", JSON.stringify(res.rotationPics));
       // window.location.href = "/html5/index.html";
    }
    var errorFunc = function(res) {

    }
    $.ajax({
        url: '/content.do',
        type: "get",
        dataType: "json",
        success: succesFunc,
        error: errorFunc
    });
</script>
</html>
