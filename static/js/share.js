var share = {
    shareFriend: function() {
        wx.onMenuShareAppMessage({
            title: '扫码自购', // 分享标题
            desc: '小麦公社自助收银，省钱省时又省力', // 分享描述
            link: 'https://tscan.imxiaomai.com/auth.do', // 分享链接
            imgUrl: 'http://upload.imxiaomai.com/gaiaUpload/2017/3/1/500f580124513c93bfd1e207ce23e542.jpg', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                alert("分享成功")
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
                alert("分享失败")
            }
        });
    },
    shareMenu: function() {
        wx.onMenuShareTimeline({
            title: '扫码自购', // 分享标题
            link: 'https://tscan.imxiaomai.com/auth.do', // 分享链接
            imgUrl: 'http://upload.imxiaomai.com/gaiaUpload/2017/3/1/500f580124513c93bfd1e207ce23e542.jpg', // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                alert("分享成功")
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
                alert("分享失败")
            }
        });
    }
};
export default share