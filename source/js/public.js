var baseUrl = "http://120.26.58.36"
var ADMIN_CONFIG = {
    "homePage": "welcome.html",
    "mainBodySelector": "#admin_body",
    "headerSelector": "#admin_header",
    "contentSelector": "#admin_content",
    "leftSelector": "#admin_left",
    "footerSelector": "#admin_footer",
    "contentTableSelector": "#admin_content_table"
};

$(function() {
    adminInit();
    resizeContentTable();
    window.page = {};
    function adminInit() {
        eventBind();
        basicAjax();
    }
});

function eventBind() {
    // eventBind 仅进行一次
    // 页面刷新 hash变化时的处理
    $(window).bind('load hashchange', loadContent);
    $(window).bind('load', leftMenuPlace);
    // $(window).bind('resize', windowReset);
    $(window).bind('click', function() {
        $("[data-hideWhenBlur]").hide();
    });
    $(window).bind('resize', function() {
        resizeContentTable();
    })
    $(window).on('click', '[data-urlBack]', function() {
        window.history.back();
    })
    $(ADMIN_CONFIG.headerSelector + " .client").bind("click", function(e) {
        if ($(".dropdown-menu").is(":hidden")) {
            $(".dropdown-menu").show();
        } else {
            $(".dropdown-menu").hide();
        }
        e.stopPropagation();
    });
    $(".admin_content").on('click', '.backBtn', function(event) {
        history.back();
    });
    $("window").on('click', '.logout', function(event) {
        event.preventDefault();
        $.post('/auth/logout', function(data, textStatus, xhr) {
            if (data.state == 0) {
                window.location.href = "sign_in.html"
            }
        });
    });
    if (!document.addEventListener) {
        // IE6~IE8
        document.write('<script src="ieBetter.js"><\/script>');
    }
    // if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
    //     $(".admin_body").on('change', "#uploadPic", function(event) {
    //         $("form").submit();
    //     });
    // } else {
    //     console.log('test');
    //     $(".admin_body").on('change', "#uploadPic", function(event) {
    //         event.preventDefault();
    //         console.log($(this)[0].files);
    //         var file = $(this)[0].files[0];
    //         if (!/image\/\w+/.test(file.type)) {
    //             alert("文件必须为图片！");
    //             return false;
    //         }
    //         var reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = function(e) {
    //                 createCanvas(this.result);
    //             }
    //             // $("form").submit();
    //     });
    // }

    // function createCanvas(src) {
    //     var canvas = document.getElementById("uploadImg");
    //     var cxt = canvas.getContext('2d');
    //     // canvas.width = 640;
    //     // canvas.height = 400;
    //     var img = new Image();
    //     img.src = src;
    //     img.onload = function() {
    //         var w = img.width;
    //         var h = img.height;
    //         canvas.width = w;
    //         canvas.height = h;
    //         cxt.drawImage(img, 0, 0);
    //         var dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    //         $(".showPic").show().attr('src', dataUrl);
    //         var blob = dataURLtoBlob(dataUrl);
    //         var fd = new FormData();
    //         fd.append("file", blob, "1.png");
    //         console.log(fd);
    //         $.ajax({
    //             url: "/upload",
    //             type: "POST",
    //             contentType: false,
    //             processData: false,
    //             data: fd,
    //             success: function(data) {
    //                 console.log(data.id);
    //                 $(".showPic").show().attr('data-id', "/" + data.id);
    //             }
    //         });
    //     }
    // }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }
    $(ADMIN_CONFIG.leftSelector + " .leftmenu>div>.line").bind('click', function(e) {
        if ($(this).next('.submenu').length) {
            // 有子菜单
            if ($(this).hasClass("active")) {
                // 打开的
                $(".line").removeClass("chosenLine");
                $(this).next('.submenu').slideUp(300);
                $(this).removeClass("active");
                $(this).find('.flaticon-arrows-1').hide();
                $(this).find('.flaticon-arrows').show();
            } else {
                $('.submenu').slideUp(300);
                $(".line").removeClass("active");
                $(".line").removeClass("chosenLine");
                $('.flaticon-arrows-1').hide();
                $('.flaticon-arrows').show();
                $(this).next('.submenu').slideDown(300);
                $(this).addClass("active");
                $(this).find('.flaticon-arrows').hide();
                $(this).find('.flaticon-arrows-1').show();
            }
        } else {
            $(".line").removeClass('chosenLine')
            $(".line").removeClass('chosen')
            $(this).addClass("chosenLine");
        }
    });
}

function basicAjax() {
    var id = localStorage.getItem("id");
    $.post(baseUrl + '/model', { name: 'User', start: "-1", "rows": id }, function(data, textStatus, xhr) {
        if (data.state == 0) {
            $(".client .name").text(data.data.username + "(" + data.data.region.name + ")");
        }
        else if (data.state == 10001 & window.location.href.search("sign_in") == -1) {
            alert("登录超时，请重新登录");
            window.location.href = "sign_in.html"
        }
    });
    $.get(baseUrl + '/region/getStatistics', function(data) {
        if (data.state == 0) {
            $(".tips #todayTask").text(data.todayTask);
            $(".tips #todayCensor").text(data.todayCensor);
        }
    });
}

function uiComponentEventBind() {
    // $(".tableBox table").tablesorter();
    $(".uploadPic").off().on('change', function(event) {
        event.preventDefault();
        var parent = $(this).parents(".admin_ui_imgUpload");
        var multiFlag = false;
        if (!($(this).attr("multiple") == undefined)) {
            multiFlag = true;
        }
        for (var i = 0; i < $(this)[0].files.length; i++) {
            var file = $(this)[0].files[i];
            if (file.size > 2097152) {
                alert("上传图片请小于2M");
                return false;
            }
            if (!/image\/\w+/.test(file.type)) {
                alert("文件必须为图片！");
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                createCanvas(this.result, multiFlag, parent);
            }
        }
    });

    $.each($("[data-autoComplete]"), function() {
        var $this = $(this);
        var $input = $(this).children('input');
        var params = $this.attr('data-params');
        var regx = /<js>(.*?)<\/js>/g;

        if (!$input.siblings('.admin_ui_input_autoComplete_selectBox').length) {
            $input.after('<div class="admin_ui_input_autoComplete_selectBox" data-hideWhenBlur></div>');
        }
        var selectBox = $input.siblings(".admin_ui_input_autoComplete_selectBox");
        var timeout;
        $input.bind('input', function() {
            var keyword = $.trim($input.val());
            if (keyword != "") {
                var _params = params;
                do {
                    var matchArr = regx.exec(params);
                    matchArr && (_params = _params.replace(/<js>.*?<\/js>/, eval(matchArr[1])));
                } while (regx.lastIndex);
                _params = JSON.parse(_params);
                timeout && clearTimeout(timeout);
                timeout = setTimeout(function() {
                    selectBox.empty().hide();
                    $.ajax(_params).done(function(data) {
                        if (data.state == 0) {
                            var textArr = data.data;
                            if (textArr.length > 0) {
                                for (var i = 0, length = textArr.length; i < length; i++) {
                                    var line = $('<div class="line">' +
                                        textArr[i] +
                                        '</div>');
                                    line.bind('click', function() {
                                        if (!$this.siblings('.admin_ui_input_tagBox').length) {
                                            $this.before('<div class="admin_ui_input_tagBox"></div>');
                                            $this.siblings('.admin_ui_input_tagBox').on('click', '.admin_ui_colorLabel', function() {
                                                $(this).remove();
                                            });
                                        }
                                        var tagBox = $this.siblings('.admin_ui_input_tagBox');
                                        var length = length = tagBox.children('.admin_ui_colorLabel').length;
                                        if (length) {
                                            for (var k = 0; k < length; k++) {
                                                if (tagBox.children('.admin_ui_colorLabel').eq(k).text() == $(this).text()) {
                                                    break;
                                                }
                                                if (k == length - 1) {
                                                    tagBox.append('<div class="admin_ui_colorLabel">' + $(this).text() + '</div>');
                                                }
                                            }
                                        } else {
                                            tagBox.append('<div class="admin_ui_colorLabel">' + $(this).text() + '</div>');
                                        }
                                    });
                                    selectBox.append(line);
                                }
                                selectBox.show();
                            } else {
                                var line = '<div class="line" onclick="return false">' +
                                    '无搜索结果' +
                                    '</div>';
                                selectBox.append(line);
                            }
                        }
                    }).fail(function(data) {
                        console.log(data);
                    });
                }, 500);
            } else {
                selectBox.empty().hide();
            }
        })
    });

}

// 获得编辑器中内容
function getEditorContent() {
    return editor.getContent();
}
// 设置编辑器内容
function setEditorContent(html) {
    editor.setContent(html);
}
// 往编辑器中插入内容
function insertContentToEditor(html) {
    editor.insertContent(html);
}
// 设置 "design", "code" or "readonly"
function setEditorMode(mode) {
    editor.setMode(mode);
}
// base64转blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function windowReset() {
    var h = $(window).height() - $("#admin_header").height();
    $(".admin_scrollBox").height(h);
}

function resizeContentTable() {
    var height = $(window).height() - $(ADMIN_CONFIG.headerSelector).height() - $(ADMIN_CONFIG.footerSelector).height();
    $(ADMIN_CONFIG.contentTableSelector).css({
        "min-height": height
    });
}

function loadContent(event) {
    var hash = window.location.hash;
    var url = window.location.href;
    
    if (hash == "" && url.search("Index_c") == -1) {
        hash = "#/" + ADMIN_CONFIG.homePage;
    } else if (hash == "" && url.search("Index_c") !== -1) {
        hash = "#/" + "assessmentCheck.html"
    }
    var hashArray = hash.split("/");
    
    window.page.beforeUnload = function(){
        return true;
    }
    $(ADMIN_CONFIG.contentSelector).load(hash.split("/")[1], function() {
        uiComponentEventBind();
        $(".submenu .line").removeClass('chosen')
        .filter("[href='"+hash+"']").addClass("chosen")
        .closest(".submenu").prev(".line").not(".active").trigger("click");
    });
    
}
$(document).on('click','a[href^="#/"]',function(e){
    $(".line").removeClass('chosenLine');
    if ($(this).attr('id')=="homePageBtn") {
        $(this).addClass('chosenLine')
    }
    var hash = $(this).attr("href");
    if(window.page.beforeUnload(hash)){

    }
    else{
        event.preventDefault();
    }
})
function leftMenuPlace() {
    var hash = window.location.hash;
    if (window.location.href.search("Index_c") == -1) {
        if (hash.match("safeDataMap") || !hash || hash.match("welcome")) {
            $("#homePageBtn").addClass('chosenLine');
        }
    }else if(!hash){
        $(".leftmenu>div>.line").eq(1).trigger("click");
        $(".active+.submenu>.line").eq(0).addClass('chosen');
    }

    // if (hash.match("companyInfoManagement") || hash.match("staffManagement")) {
    //     console.log($(".leftmenu>div>.line"));
    //     $(".leftmenu>div>.line").eq(1).trigger("click");
    //     if (hash.match("companyInfoManagement")) {
    //         $(".active+.submenu>.line").eq(0).addClass('chosen');
    //     }
    //     if (hash.match("staffManagement")) {
    //         $(".active+.submenu>.line").eq(1).addClass('chosen');
    //     }
    // }
}
