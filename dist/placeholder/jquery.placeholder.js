/*!
 * Name: placeholder-polyfill - jQuery polyfill for the HTML5 placeholder attribute.
 * Version: v0.0.1
 * Homepage: https://github.com/woneob/placeholder-polyfill
 * License: MIT
 */

(function($, doc) {
    $.fn.placeholder = function(opt) {
        var defaults = {
            wrapperTagName: "label",
            wrapperClassName: "placeholderWrap",
            placeholderTagName: "span",
            placeholderClassName: "placeholderElem",
            placeholderHideClassName: "hide",
            onlyLegacy: true
        };
        opt = $.extend(true, {}, defaults, opt);
        //"placeholder" 지원 브라우저일 경우 종료
        if (opt.onlyLegacy && "placeholder" in $("<input>")[0]) {
            return;
        }
        // placeholder를 사용 가능 여부 검사
        var placeholderable = function(elem) {
            var tags = /input|textarea/i;
            var types = /text|search|url|tel|email|password|textarea/i;
            if (!tags.test(elem.tagName) && !types.test(elem.type)) {
                return false;
            }
            return true;
        };
        // Computed 스타일 추출
        function getStyle(el) {
            if (el.currentStyle) {
                return el.currentStyle;
            } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
                return doc.defaultView.getComputedStyle(el, "");
            } else {
                return el.style;
            }
        }
        return this.each(function() {
            var $this = $(this);
            var placeholder = $this.attr("placeholder");
            if (!placeholder || !placeholderable(this)) {
                return true;
            }
            var os = getStyle($this[0]);
            // placeholder 역할을 하는 임의의 엘리먼트 생성
            var $placeholderElem = $("<" + opt.placeholderTagName + "/>", {
                "class": opt.placeholderClassName,
                text: placeholder,
                css: {
                    position: "absolute",
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    width: os.width,
                    paddingTop: os.paddingTop,
                    paddingRight: os.paddingRight,
                    paddingBottom: os.paddingBottom,
                    paddingLeft: os.paddingLeft,
                    borderTopWidth: os.borderTopWidth,
                    borderRightWidth: os.borderRightWidth,
                    borderBottomWidth: os.borderBottomWidth,
                    borderLeftWidth: os.borderLeftWidth,
                    borderColor: "transparent",
                    borderStyle: "solid",
                    lineHeight: os.lineHeight,
                    fontSize: os.fontSize,
                    fontFamily: os.fontFamily,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "text"
                }
            }).on("click", function() {
                setTimeout(function() {
                    $this.focus();
                }, 0);
            });
            var $wrapper = $("<" + opt.wrapperTagName + "/>", {
                "class": opt.wrapperClassName,
                css: {
                    position: os.position === "absolute" ? "absolute" : "relative",
                    top: os.top || "",
                    right: os.right || "",
                    bottom: os.bottom || "",
                    left: os.left || "",
                    display: "inline-block",
                    overflow: "hidden",
                    marginTop: os.marginTop,
                    marginRight: os.marginRight,
                    marginBottom: os.marginBottom,
                    marginLeft: os.marginLeft
                }
            });
            var toggle = function() {
                setTimeout(function() {
                    var isHide = $this.val();
                    var position = isHide ? -9999 : 0;
                    var classMethod = (isHide ? "add" : "remove") + "Class";
                    $placeholderElem.css("left", position);
                    $this.parent()[classMethod](opt.placeholderHideClassName);
                }, 5);
            };
            toggle();
            $this.css({
                margin: 0,
                position: "static"
            }).on("keydown change paste drop", toggle).wrap($wrapper).before($placeholderElem).removeAttr("placeholder");
            // IE Input 여백 버그 대응
            var poorMargin = $this.position().top;
            if (poorMargin > 0) {
                $placeholderElem.css("top", poorMargin);
            }
        });
    };
})(jQuery, document);
