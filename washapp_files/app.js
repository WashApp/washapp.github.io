if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function ($) {
    "use strict";
    var version = $.fn.jquery.split(" ")[0].split(".");
    if (version[0] < 2 && version[1] < 9 || 1 == version[0] && 9 == version[1] && version[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), + function ($) {
    "use strict";

    function transitionEnd() {
        var el = document.createElement("bootstrap"),
            transEndEventNames = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var name in transEndEventNames)
            if (void 0 !== el.style[name]) return {
                end: transEndEventNames[name]
            };
        return !1
    }
    $.fn.emulateTransitionEnd = function (duration) {
        var called = !1,
            $el = this;
        $(this).one("bsTransitionEnd", function () {
            called = !0
        });
        var callback = function () {
            called || $($el).trigger($.support.transition.end)
        };
        return setTimeout(callback, duration), this
    }, $(function () {
        $.support.transition = transitionEnd(), $.support.transition && ($.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                return $(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : void 0
            }
        })
    })
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.alert");
            data || $this.data("bs.alert", data = new Alert(this)), "string" == typeof option && data[option].call($this)
        })
    }
    var dismiss = '[data-dismiss="alert"]',
        Alert = function (el) {
            $(el).on("click", dismiss, this.close)
        };
    Alert.VERSION = "3.3.5", Alert.TRANSITION_DURATION = 150, Alert.prototype.close = function (e) {
        function removeElement() {
            $parent.detach().trigger("closed.bs.alert").remove()
        }
        var $this = $(this),
            selector = $this.attr("data-target");
        selector || (selector = $this.attr("href"), selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ""));
        var $parent = $(selector);
        e && e.preventDefault(), $parent.length || ($parent = $this.closest(".alert")), $parent.trigger(e = $.Event("close.bs.alert")), e.isDefaultPrevented() || ($parent.removeClass("in"), $.support.transition && $parent.hasClass("fade") ? $parent.one("bsTransitionEnd", removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement())
    };
    var old = $.fn.alert;
    $.fn.alert = Plugin, $.fn.alert.Constructor = Alert, $.fn.alert.noConflict = function () {
        return $.fn.alert = old, this
    }, $(document).on("click.bs.alert.data-api", dismiss, Alert.prototype.close)
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.button"),
                options = "object" == typeof option && option;
            data || $this.data("bs.button", data = new Button(this, options)), "toggle" == option ? data.toggle() : option && data.setState(option)
        })
    }
    var Button = function (element, options) {
        this.$element = $(element), this.options = $.extend({}, Button.DEFAULTS, options), this.isLoading = !1
    };
    Button.VERSION = "3.3.5", Button.DEFAULTS = {
        loadingText: "loading..."
    }, Button.prototype.setState = function (state) {
        var d = "disabled",
            $el = this.$element,
            val = $el.is("input") ? "val" : "html",
            data = $el.data();
        state += "Text", null == data.resetText && $el.data("resetText", $el[val]()), setTimeout($.proxy(function () {
            $el[val](null == data[state] ? this.options[state] : data[state]), "loadingText" == state ? (this.isLoading = !0, $el.addClass(d).attr(d, d)) : this.isLoading && (this.isLoading = !1, $el.removeClass(d).removeAttr(d))
        }, this), 0)
    }, Button.prototype.toggle = function () {
        var changed = !0,
            $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find("input");
            "radio" == $input.prop("type") ? ($input.prop("checked") && (changed = !1), $parent.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == $input.prop("type") && ($input.prop("checked") !== this.$element.hasClass("active") && (changed = !1), this.$element.toggleClass("active")), $input.prop("checked", this.$element.hasClass("active")), changed && $input.trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var old = $.fn.button;
    $.fn.button = Plugin, $.fn.button.Constructor = Button, $.fn.button.noConflict = function () {
        return $.fn.button = old, this
    }, $(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (e) {
        var $btn = $(e.target);
        $btn.hasClass("btn") || ($btn = $btn.closest(".btn")), Plugin.call($btn, "toggle"), $(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]') || e.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (e) {
        $(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type))
    })
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.carousel"),
                options = $.extend({}, Carousel.DEFAULTS, $this.data(), "object" == typeof option && option),
                action = "string" == typeof option ? option : options.slide;
            data || $this.data("bs.carousel", data = new Carousel(this, options)), "number" == typeof option ? data.to(option) : action ? data[action]() : options.interval && data.pause().cycle()
        })
    }
    var Carousel = function (element, options) {
        this.$element = $(element), this.$indicators = this.$element.find(".carousel-indicators"), this.options = options, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", $.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this))
    };
    Carousel.VERSION = "3.3.5", Carousel.TRANSITION_DURATION = 600, Carousel.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, Carousel.prototype.keydown = function (e) {
        if (!/input|textarea/i.test(e.target.tagName)) {
            switch (e.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return
            }
            e.preventDefault()
        }
    }, Carousel.prototype.cycle = function (e) {
        return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval)), this
    }, Carousel.prototype.getItemIndex = function (item) {
        return this.$items = item.parent().children(".item"), this.$items.index(item || this.$active)
    }, Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active),
            willWrap = "prev" == direction && 0 === activeIndex || "next" == direction && activeIndex == this.$items.length - 1;
        if (willWrap && !this.options.wrap) return active;
        var delta = "prev" == direction ? -1 : 1,
            itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex)
    }, Carousel.prototype.to = function (pos) {
        var that = this,
            activeIndex = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return pos > this.$items.length - 1 || 0 > pos ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
            that.to(pos)
        }) : activeIndex == pos ? this.pause().cycle() : this.slide(pos > activeIndex ? "next" : "prev", this.$items.eq(pos))
    }, Carousel.prototype.pause = function (e) {
        return e || (this.paused = !0), this.$element.find(".next, .prev").length && $.support.transition && (this.$element.trigger($.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, Carousel.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next")
    }, Carousel.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev")
    }, Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find(".item.active"),
            $next = next || this.getItemForDirection(type, $active),
            isCycling = this.interval,
            direction = "next" == type ? "left" : "right",
            that = this;
        if ($next.hasClass("active")) return this.sliding = !1;
        var relatedTarget = $next[0],
            slideEvent = $.Event("slide.bs.carousel", {
                relatedTarget: relatedTarget,
                direction: direction
            });
        if (this.$element.trigger(slideEvent), !slideEvent.isDefaultPrevented()) {
            if (this.sliding = !0, isCycling && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
                $nextIndicator && $nextIndicator.addClass("active")
            }
            var slidEvent = $.Event("slid.bs.carousel", {
                relatedTarget: relatedTarget,
                direction: direction
            });
            return $.support.transition && this.$element.hasClass("slide") ? ($next.addClass(type), $next[0].offsetWidth, $active.addClass(direction), $next.addClass(direction), $active.one("bsTransitionEnd", function () {
                $next.removeClass([type, direction].join(" ")).addClass("active"), $active.removeClass(["active", direction].join(" ")), that.sliding = !1, setTimeout(function () {
                    that.$element.trigger(slidEvent)
                }, 0)
            }).emulateTransitionEnd(Carousel.TRANSITION_DURATION)) : ($active.removeClass("active"), $next.addClass("active"), this.sliding = !1, this.$element.trigger(slidEvent)), isCycling && this.cycle(), this
        }
    };
    var old = $.fn.carousel;
    $.fn.carousel = Plugin, $.fn.carousel.Constructor = Carousel, $.fn.carousel.noConflict = function () {
        return $.fn.carousel = old, this
    };
    var clickHandler = function (e) {
        var href, $this = $(this),
            $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""));
        if ($target.hasClass("carousel")) {
            var options = $.extend({}, $target.data(), $this.data()),
                slideIndex = $this.attr("data-slide-to");
            slideIndex && (options.interval = !1), Plugin.call($target, options), slideIndex && $target.data("bs.carousel").to(slideIndex), e.preventDefault()
        }
    };
    $(document).on("click.bs.carousel.data-api", "[data-slide]", clickHandler).on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler), $(window).on("load", function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data())
        })
    })
}(jQuery), + function ($) {
    "use strict";

    function getTargetFromTrigger($trigger) {
        var href, target = $trigger.attr("data-target") || (href = $trigger.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "");
        return $(target)
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.collapse"),
                options = $.extend({}, Collapse.DEFAULTS, $this.data(), "object" == typeof option && option);
            !data && options.toggle && /show|hide/.test(option) && (options.toggle = !1), data || $this.data("bs.collapse", data = new Collapse(this, options)), "string" == typeof option && data[option]()
        })
    }
    var Collapse = function (element, options) {
        this.$element = $(element), this.options = $.extend({}, Collapse.DEFAULTS, options), this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],[data-toggle="collapse"][data-target="#' + element.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    Collapse.VERSION = "3.3.5", Collapse.TRANSITION_DURATION = 350, Collapse.DEFAULTS = {
        toggle: !0
    }, Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height"
    }, Collapse.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var activesData, actives = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(actives && actives.length && (activesData = actives.data("bs.collapse"), activesData && activesData.transitioning))) {
                var startEvent = $.Event("show.bs.collapse");
                if (this.$element.trigger(startEvent), !startEvent.isDefaultPrevented()) {
                    actives && actives.length && (Plugin.call(actives, "hide"), activesData || actives.data("bs.collapse", null));
                    var dimension = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[dimension](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var complete = function () {
                        this.$element.removeClass("collapsing").addClass("collapse in")[dimension](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!$.support.transition) return complete.call(this);
                    var scrollSize = $.camelCase(["scroll", dimension].join("-"));
                    this.$element.one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
                }
            }
        }
    }, Collapse.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var startEvent = $.Event("hide.bs.collapse");
            if (this.$element.trigger(startEvent), !startEvent.isDefaultPrevented()) {
                var dimension = this.dimension();
                this.$element[dimension](this.$element[dimension]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var complete = function () {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return $.support.transition ? void this.$element[dimension](0).one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION) : complete.call(this)
            }
        }
    }, Collapse.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, Collapse.prototype.getParent = function () {
        return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
            var $element = $(element);
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this)).end()
    }, Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass("in");
        $element.attr("aria-expanded", isOpen), $trigger.toggleClass("collapsed", !isOpen).attr("aria-expanded", isOpen)
    };
    var old = $.fn.collapse;
    $.fn.collapse = Plugin, $.fn.collapse.Constructor = Collapse, $.fn.collapse.noConflict = function () {
        return $.fn.collapse = old, this
    }, $(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (e) {
        var $this = $(this);
        $this.attr("data-target") || e.preventDefault();
        var $target = getTargetFromTrigger($this),
            data = $target.data("bs.collapse"),
            option = data ? "toggle" : $this.data();
        Plugin.call($target, option)
    })
}(jQuery), + function ($) {
    "use strict";

    function getParent($this) {
        var selector = $this.attr("data-target");
        selector || (selector = $this.attr("href"), selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ""));
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        e && 3 === e.which || ($(backdrop).remove(), $(toggle).each(function () {
            var $this = $(this),
                $parent = getParent($this),
                relatedTarget = {
                    relatedTarget: this
                };
            $parent.hasClass("open") && (e && "click" == e.type && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target) || ($parent.trigger(e = $.Event("hide.bs.dropdown", relatedTarget)), e.isDefaultPrevented() || ($this.attr("aria-expanded", "false"), $parent.removeClass("open").trigger("hidden.bs.dropdown", relatedTarget))))
        }))
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.dropdown");
            data || $this.data("bs.dropdown", data = new Dropdown(this)), "string" == typeof option && data[option].call($this)
        })
    }
    var backdrop = ".dropdown-backdrop",
        toggle = '[data-toggle="dropdown"]',
        Dropdown = function (element) {
            $(element).on("click.bs.dropdown", this.toggle)
        };
    Dropdown.VERSION = "3.3.5", Dropdown.prototype.toggle = function (e) {
        var $this = $(this);
        if (!$this.is(".disabled, :disabled")) {
            var $parent = getParent($this),
                isActive = $parent.hasClass("open");
            if (clearMenus(), !isActive) {
                "ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length && $(document.createElement("div")).addClass("dropdown-backdrop").insertAfter($(this)).on("click", clearMenus);
                var relatedTarget = {
                    relatedTarget: this
                };
                if ($parent.trigger(e = $.Event("show.bs.dropdown", relatedTarget)), e.isDefaultPrevented()) return;
                $this.trigger("focus").attr("aria-expanded", "true"), $parent.toggleClass("open").trigger("shown.bs.dropdown", relatedTarget)
            }
            return !1
        }
    }, Dropdown.prototype.keydown = function (e) {
        if (/(38|40|27|32)/.test(e.which) && !/input|textarea/i.test(e.target.tagName)) {
            var $this = $(this);
            if (e.preventDefault(), e.stopPropagation(), !$this.is(".disabled, :disabled")) {
                var $parent = getParent($this),
                    isActive = $parent.hasClass("open");
                if (!isActive && 27 != e.which || isActive && 27 == e.which) return 27 == e.which && $parent.find(toggle).trigger("focus"), $this.trigger("click");
                var desc = " li:not(.disabled):visible a",
                    $items = $parent.find(".dropdown-menu" + desc);
                if ($items.length) {
                    var index = $items.index(e.target);
                    38 == e.which && index > 0 && index--, 40 == e.which && index < $items.length - 1 && index++, ~index || (index = 0), $items.eq(index).trigger("focus")
                }
            }
        }
    };
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin, $.fn.dropdown.Constructor = Dropdown, $.fn.dropdown.noConflict = function () {
        return $.fn.dropdown = old, this
    }, $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
        e.stopPropagation()
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle, Dropdown.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", Dropdown.prototype.keydown)
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.modal"),
                options = $.extend({}, Modal.DEFAULTS, $this.data(), "object" == typeof option && option);
            data || $this.data("bs.modal", data = new Modal(this, options)), "string" == typeof option ? data[option](_relatedTarget) : options.show && data.show(_relatedTarget)
        })
    }
    var Modal = function (element, options) {
        this.options = options, this.$body = $(document.body), this.$element = $(element), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, $.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    Modal.VERSION = "3.3.5", Modal.TRANSITION_DURATION = 300, Modal.BACKDROP_TRANSITION_DURATION = 150, Modal.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }, Modal.prototype.show = function (_relatedTarget) {
        var that = this,
            e = $.Event("show.bs.modal", {
                relatedTarget: _relatedTarget
            });
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function () {
            that.$element.one("mouseup.dismiss.bs.modal", function (e) {
                $(e.target).is(that.$element) && (that.ignoreBackdropClick = !0)
            })
        }), this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass("fade");
            that.$element.parent().length || that.$element.appendTo(that.$body), that.$element.show().scrollTop(0), that.adjustDialog(), transition && that.$element[0].offsetWidth, that.$element.addClass("in"), that.enforceFocus();
            var e = $.Event("shown.bs.modal", {
                relatedTarget: _relatedTarget
            });
            transition ? that.$dialog.one("bsTransitionEnd", function () {
                that.$element.trigger("focus").trigger(e)
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger("focus").trigger(e)
        }))
    }, Modal.prototype.hide = function (e) {
        e && e.preventDefault(), e = $.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), $(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), $.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal())
    }, Modal.prototype.enforceFocus = function () {
        $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function (e) {
            this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger("focus")
        }, this))
    }, Modal.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", $.proxy(function (e) {
            27 == e.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, Modal.prototype.resize = function () {
        this.isShown ? $(window).on("resize.bs.modal", $.proxy(this.handleUpdate, this)) : $(window).off("resize.bs.modal")
    }, Modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide(), this.backdrop(function () {
            that.$body.removeClass("modal-open"), that.resetAdjustments(), that.resetScrollbar(), that.$element.trigger("hidden.bs.modal")
        })
    }, Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, Modal.prototype.backdrop = function (callback) {
        var that = this,
            animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            if (this.$backdrop = $(document.createElement("div")).addClass("modal-backdrop " + animate).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", $.proxy(function (e) {
                    return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                }, this)), doAnimate && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !callback) return;
            doAnimate ? this.$backdrop.one("bsTransitionEnd", callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var callbackRemove = function () {
                that.removeBackdrop(), callback && callback()
            };
            $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove()
        } else callback && callback()
    }, Modal.prototype.handleUpdate = function () {
        this.adjustDialog()
    }, Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ""
        })
    }, Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }, Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) {
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth, this.scrollbarWidth = this.measureScrollbar()
    }, Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", bodyPad + this.scrollbarWidth)
    }, Modal.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", this.originalBodyPad)
    }, Modal.prototype.measureScrollbar = function () {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "modal-scrollbar-measure", this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        return this.$body[0].removeChild(scrollDiv), scrollbarWidth
    };
    var old = $.fn.modal;
    $.fn.modal = Plugin, $.fn.modal.Constructor = Modal, $.fn.modal.noConflict = function () {
        return $.fn.modal = old, this
    }, $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (e) {
        var $this = $(this),
            href = $this.attr("href"),
            $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, "")),
            option = $target.data("bs.modal") ? "toggle" : $.extend({
                remote: !/#/.test(href) && href
            }, $target.data(), $this.data());
        $this.is("a") && e.preventDefault(), $target.one("show.bs.modal", function (showEvent) {
            showEvent.isDefaultPrevented() || $target.one("hidden.bs.modal", function () {
                $this.is(":visible") && $this.trigger("focus")
            })
        }), Plugin.call($target, option, this)
    })
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.tooltip"),
                options = "object" == typeof option && option;
            (data || !/destroy|hide/.test(option)) && (data || $this.data("bs.tooltip", data = new Tooltip(this, options)), "string" == typeof option && data[option]())
        })
    }
    var Tooltip = function (element, options) {
        this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", element, options)
    };
    Tooltip.VERSION = "3.3.5", Tooltip.TRANSITION_DURATION = 150, Tooltip.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    }, Tooltip.prototype.init = function (type, element, options) {
        if (this.enabled = !0, this.type = type, this.$element = $(element), this.options = this.getOptions(options), this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                click: !1,
                hover: !1,
                focus: !1
            }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var triggers = this.options.trigger.split(" "), i = triggers.length; i--;) {
            var trigger = triggers[i];
            if ("click" == trigger) this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            else if ("manual" != trigger) {
                var eventIn = "hover" == trigger ? "mouseenter" : "focusin",
                    eventOut = "hover" == trigger ? "mouseleave" : "focusout";
                this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this)), this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }, Tooltip.prototype.getOptions = function (options) {
        return options = $.extend({}, this.getDefaults(), this.$element.data(), options), options.delay && "number" == typeof options.delay && (options.delay = {
            show: options.delay,
            hide: options.delay
        }), options
    }, Tooltip.prototype.getDelegateOptions = function () {
        var options = {},
            defaults = this.getDefaults();
        return this._options && $.each(this._options, function (key, value) {
            defaults[key] != value && (options[key] = value)
        }), options
    }, Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        return self || (self = new this.constructor(obj.currentTarget, this.getDelegateOptions()), $(obj.currentTarget).data("bs." + this.type, self)), obj instanceof $.Event && (self.inState["focusin" == obj.type ? "focus" : "hover"] = !0), self.tip().hasClass("in") || "in" == self.hoverState ? void(self.hoverState = "in") : (clearTimeout(self.timeout), self.hoverState = "in", self.options.delay && self.options.delay.show ? void(self.timeout = setTimeout(function () {
            "in" == self.hoverState && self.show()
        }, self.options.delay.show)) : self.show())
    }, Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState)
            if (this.inState[key]) return !0;
        return !1
    }, Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        return self || (self = new this.constructor(obj.currentTarget, this.getDelegateOptions()), $(obj.currentTarget).data("bs." + this.type, self)), obj instanceof $.Event && (self.inState["focusout" == obj.type ? "focus" : "hover"] = !1), self.isInStateTrue() ? void 0 : (clearTimeout(self.timeout), self.hoverState = "out", self.options.delay && self.options.delay.hide ? void(self.timeout = setTimeout(function () {
            "out" == self.hoverState && self.hide()
        }, self.options.delay.hide)) : self.hide())
    }, Tooltip.prototype.show = function () {
        var e = $.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this,
                $tip = this.tip(),
                tipId = this.getUID(this.type);
            this.setContent(), $tip.attr("id", tipId), this.$element.attr("aria-describedby", tipId), this.options.animation && $tip.addClass("fade");
            var placement = "function" == typeof this.options.placement ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement,
                autoToken = /\s?auto?\s?/i,
                autoPlace = autoToken.test(placement);
            autoPlace && (placement = placement.replace(autoToken, "") || "top"), $tip.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(placement).data("bs." + this.type, this), this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
            var pos = this.getPosition(),
                actualWidth = $tip[0].offsetWidth,
                actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var orgPlacement = placement,
                    viewportDim = this.getPosition(this.$viewport);
                placement = "bottom" == placement && pos.bottom + actualHeight > viewportDim.bottom ? "top" : "top" == placement && pos.top - actualHeight < viewportDim.top ? "bottom" : "right" == placement && pos.right + actualWidth > viewportDim.width ? "left" : "left" == placement && pos.left - actualWidth < viewportDim.left ? "right" : placement, $tip.removeClass(orgPlacement).addClass(placement)
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function () {
                var prevHoverState = that.hoverState;
                that.$element.trigger("shown.bs." + that.type), that.hoverState = null, "out" == prevHoverState && that.leave(that)
            };
            $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()
        }
    }, Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip(),
            width = $tip[0].offsetWidth,
            height = $tip[0].offsetHeight,
            marginTop = parseInt($tip.css("margin-top"), 10),
            marginLeft = parseInt($tip.css("margin-left"), 10);
        isNaN(marginTop) && (marginTop = 0), isNaN(marginLeft) && (marginLeft = 0), offset.top += marginTop, offset.left += marginLeft, $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0), $tip.addClass("in");
        var actualWidth = $tip[0].offsetWidth,
            actualHeight = $tip[0].offsetHeight;
        "top" == placement && actualHeight != height && (offset.top = offset.top + height - actualHeight);
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        delta.left ? offset.left += delta.left : offset.top += delta.top;
        var isVertical = /top|bottom/.test(placement),
            arrowDelta = isVertical ? 2 * delta.left - width + actualWidth : 2 * delta.top - height + actualHeight,
            arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight";
        $tip.offset(offset), this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }, Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow().css(isVertical ? "left" : "top", 50 * (1 - delta / dimension) + "%").css(isVertical ? "top" : "left", "")
    }, Tooltip.prototype.setContent = function () {
        var $tip = this.tip(),
            title = this.getTitle();
        $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title), $tip.removeClass("fade in top bottom left right")
    }, Tooltip.prototype.hide = function (callback) {
        function complete() {
            "in" != that.hoverState && $tip.detach(), that.$element.removeAttr("aria-describedby").trigger("hidden.bs." + that.type), callback && callback()
        }
        var that = this,
            $tip = $(this.$tip),
            e = $.Event("hide.bs." + this.type);
        return this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : ($tip.removeClass("in"), $.support.transition && $tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete(), this.hoverState = null, this)
    }, Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        ($e.attr("title") || "string" != typeof $e.attr("data-original-title")) && $e.attr("data-original-title", $e.attr("title") || "").attr("title", "")
    }, Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }, Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element;
        var el = $element[0],
            isBody = "BODY" == el.tagName,
            elRect = el.getBoundingClientRect();
        null == elRect.width && (elRect = $.extend({}, elRect, {
            width: elRect.right - elRect.left,
            height: elRect.bottom - elRect.top
        }));
        var elOffset = isBody ? {
                top: 0,
                left: 0
            } : $element.offset(),
            scroll = {
                scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
            },
            outerDims = isBody ? {
                width: $(window).width(),
                height: $(window).height()
            } : null;
        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }, Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return "bottom" == placement ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : "top" == placement ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : "left" == placement ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        }
    }, Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return delta;
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0,
            viewportDimensions = this.getPosition(this.$viewport);
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll,
                bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            topEdgeOffset < viewportDimensions.top ? delta.top = viewportDimensions.top - topEdgeOffset : bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height && (delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset)
        } else {
            var leftEdgeOffset = pos.left - viewportPadding,
                rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            leftEdgeOffset < viewportDimensions.left ? delta.left = viewportDimensions.left - leftEdgeOffset : rightEdgeOffset > viewportDimensions.right && (delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset)
        }
        return delta
    }, Tooltip.prototype.getTitle = function () {
        var title, $e = this.$element,
            o = this.options;
        return title = $e.attr("data-original-title") || ("function" == typeof o.title ? o.title.call($e[0]) : o.title)
    }, Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(1e6 * Math.random()); while (document.getElementById(prefix));
        return prefix
    }, Tooltip.prototype.tip = function () {
        if (!this.$tip && (this.$tip = $(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }, Tooltip.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, Tooltip.prototype.enable = function () {
        this.enabled = !0
    }, Tooltip.prototype.disable = function () {
        this.enabled = !1
    }, Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }, Tooltip.prototype.toggle = function (e) {
        var self = this;
        e && (self = $(e.currentTarget).data("bs." + this.type), self || (self = new this.constructor(e.currentTarget, this.getDelegateOptions()), $(e.currentTarget).data("bs." + this.type, self))), e ? (self.inState.click = !self.inState.click, self.isInStateTrue() ? self.enter(self) : self.leave(self)) : self.tip().hasClass("in") ? self.leave(self) : self.enter(self)
    }, Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout), this.hide(function () {
            that.$element.off("." + that.type).removeData("bs." + that.type), that.$tip && that.$tip.detach(), that.$tip = null, that.$arrow = null, that.$viewport = null
        })
    };
    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin, $.fn.tooltip.Constructor = Tooltip, $.fn.tooltip.noConflict = function () {
        return $.fn.tooltip = old, this
    }
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.popover"),
                options = "object" == typeof option && option;
            (data || !/destroy|hide/.test(option)) && (data || $this.data("bs.popover", data = new Popover(this, options)), "string" == typeof option && data[option]())
        })
    }
    var Popover = function (element, options) {
        this.init("popover", element, options)
    };
    if (!$.fn.tooltip) throw new Error("Popover requires tooltip.js");
    Popover.VERSION = "3.3.5", Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype), Popover.prototype.constructor = Popover, Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }, Popover.prototype.setContent = function () {
        var $tip = this.tip(),
            title = this.getTitle(),
            content = this.getContent();
        $tip.find(".popover-title")[this.options.html ? "html" : "text"](title), $tip.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof content ? "html" : "append" : "text"](content), $tip.removeClass("fade top bottom left right in"), $tip.find(".popover-title").html() || $tip.find(".popover-title").hide()
    }, Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }, Popover.prototype.getContent = function () {
        var $e = this.$element,
            o = this.options;
        return $e.attr("data-content") || ("function" == typeof o.content ? o.content.call($e[0]) : o.content)
    }, Popover.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var old = $.fn.popover;
    $.fn.popover = Plugin, $.fn.popover.Constructor = Popover, $.fn.popover.noConflict = function () {
        return $.fn.popover = old, this
    }
}(jQuery), + function ($) {
    "use strict";

    function ScrollSpy(element, options) {
        this.$body = $(document.body), this.$scrollElement = $($(element).is(document.body) ? window : element), this.options = $.extend({}, ScrollSpy.DEFAULTS, options), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", $.proxy(this.process, this)), this.refresh(), this.process()
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.scrollspy"),
                options = "object" == typeof option && option;
            data || $this.data("bs.scrollspy", data = new ScrollSpy(this, options)), "string" == typeof option && data[option]()
        })
    }
    ScrollSpy.VERSION = "3.3.5", ScrollSpy.DEFAULTS = {
        offset: 10
    }, ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, ScrollSpy.prototype.refresh = function () {
        var that = this,
            offsetMethod = "offset",
            offsetBase = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), $.isWindow(this.$scrollElement[0]) || (offsetMethod = "position", offsetBase = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function () {
            var $el = $(this),
                href = $el.data("target") || $el.attr("href"),
                $href = /^#./.test(href) && $(href);
            return $href && $href.length && $href.is(":visible") && [[$href[offsetMethod]().top + offsetBase, href]] || null
        }).sort(function (a, b) {
            return a[0] - b[0]
        }).each(function () {
            that.offsets.push(this[0]), that.targets.push(this[1])
        })
    }, ScrollSpy.prototype.process = function () {
        var i, scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
            scrollHeight = this.getScrollHeight(),
            maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height(),
            offsets = this.offsets,
            targets = this.targets,
            activeTarget = this.activeTarget;
        if (this.scrollHeight != scrollHeight && this.refresh(), scrollTop >= maxScroll) return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
        if (activeTarget && scrollTop < offsets[0]) return this.activeTarget = null, this.clear();
        for (i = offsets.length; i--;) activeTarget != targets[i] && scrollTop >= offsets[i] && (void 0 === offsets[i + 1] || scrollTop < offsets[i + 1]) && this.activate(targets[i])
    }, ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target, this.clear();
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]',
            active = $(selector).parents("li").addClass("active");
        active.parent(".dropdown-menu").length && (active = active.closest("li.dropdown").addClass("active")), active.trigger("activate.bs.scrollspy")
    }, ScrollSpy.prototype.clear = function () {
        $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin, $.fn.scrollspy.Constructor = ScrollSpy, $.fn.scrollspy.noConflict = function () {
        return $.fn.scrollspy = old, this
    }, $(window).on("load.bs.scrollspy.data-api", function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            Plugin.call($spy, $spy.data())
        })
    })
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.tab");
            data || $this.data("bs.tab", data = new Tab(this)), "string" == typeof option && data[option]()
        })
    }
    var Tab = function (element) {
        this.element = $(element)
    };
    Tab.VERSION = "3.3.5", Tab.TRANSITION_DURATION = 150, Tab.prototype.show = function () {
        var $this = this.element,
            $ul = $this.closest("ul:not(.dropdown-menu)"),
            selector = $this.data("target");
        if (selector || (selector = $this.attr("href"), selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "")), !$this.parent("li").hasClass("active")) {
            var $previous = $ul.find(".active:last a"),
                hideEvent = $.Event("hide.bs.tab", {
                    relatedTarget: $this[0]
                }),
                showEvent = $.Event("show.bs.tab", {
                    relatedTarget: $previous[0]
                });
            if ($previous.trigger(hideEvent), $this.trigger(showEvent), !showEvent.isDefaultPrevented() && !hideEvent.isDefaultPrevented()) {
                var $target = $(selector);
                this.activate($this.closest("li"), $ul), this.activate($target, $target.parent(), function () {
                    $previous.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: $this[0]
                    }), $this.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: $previous[0]
                    })
                })
            }
        }
    }, Tab.prototype.activate = function (element, container, callback) {
        function next() {
            $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), element.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), transition ? (element[0].offsetWidth, element.addClass("in")) : element.removeClass("fade"), element.parent(".dropdown-menu").length && element.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), callback && callback()
        }
        var $active = container.find("> .active"),
            transition = callback && $.support.transition && ($active.length && $active.hasClass("fade") || !!container.find("> .fade").length);
        $active.length && transition ? $active.one("bsTransitionEnd", next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next(), $active.removeClass("in")
    };
    var old = $.fn.tab;
    $.fn.tab = Plugin, $.fn.tab.Constructor = Tab, $.fn.tab.noConflict = function () {
        return $.fn.tab = old, this
    };
    var clickHandler = function (e) {
        e.preventDefault(), Plugin.call($(this), "show")
    };
    $(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', clickHandler).on("click.bs.tab.data-api", '[data-toggle="pill"]', clickHandler)
}(jQuery), + function ($) {
    "use strict";

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("bs.affix"),
                options = "object" == typeof option && option;
            data || $this.data("bs.affix", data = new Affix(this, options)), "string" == typeof option && data[option]()
        })
    }
    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options), this.$target = $(this.options.target).on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this)), this.$element = $(element), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    Affix.VERSION = "3.3.5", Affix.RESET = "affix affix-top affix-bottom", Affix.DEFAULTS = {
        offset: 0,
        target: window
    }, Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop(),
            position = this.$element.offset(),
            targetHeight = this.$target.height();
        if (null != offsetTop && "top" == this.affixed) return offsetTop > scrollTop ? "top" : !1;
        if ("bottom" == this.affixed) return null != offsetTop ? scrollTop + this.unpin <= position.top ? !1 : "bottom" : scrollHeight - offsetBottom >= scrollTop + targetHeight ? !1 : "bottom";
        var initializing = null == this.affixed,
            colliderTop = initializing ? scrollTop : position.top,
            colliderHeight = initializing ? targetHeight : height;
        return null != offsetTop && offsetTop >= scrollTop ? "top" : null != offsetBottom && colliderTop + colliderHeight >= scrollHeight - offsetBottom ? "bottom" : !1
    }, Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(Affix.RESET).addClass("affix");
        var scrollTop = this.$target.scrollTop(),
            position = this.$element.offset();
        return this.pinnedOffset = position.top - scrollTop
    }, Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }, Affix.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
            var height = this.$element.height(),
                offset = this.options.offset,
                offsetTop = offset.top,
                offsetBottom = offset.bottom,
                scrollHeight = Math.max($(document).height(), $(document.body).height());
            "object" != typeof offset && (offsetBottom = offsetTop = offset), "function" == typeof offsetTop && (offsetTop = offset.top(this.$element)), "function" == typeof offsetBottom && (offsetBottom = offset.bottom(this.$element));
            var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);
            if (this.affixed != affix) {
                null != this.unpin && this.$element.css("top", "");
                var affixType = "affix" + (affix ? "-" + affix : ""),
                    e = $.Event(affixType + ".bs.affix");
                if (this.$element.trigger(e), e.isDefaultPrevented()) return;
                this.affixed = affix, this.unpin = "bottom" == affix ? this.getPinnedOffset() : null, this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == affix && this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    };
    var old = $.fn.affix;
    $.fn.affix = Plugin, $.fn.affix.Constructor = Affix, $.fn.affix.noConflict = function () {
        return $.fn.affix = old, this
    }, $(window).on("load", function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this),
                data = $spy.data();
            data.offset = data.offset || {}, null != data.offsetBottom && (data.offset.bottom = data.offsetBottom), null != data.offsetTop && (data.offset.top = data.offsetTop), Plugin.call($spy, data)
        })
    })
}(jQuery),
function (global) {
    var apple_phone = /iPhone/i,
        apple_ipod = /iPod/i,
        apple_tablet = /iPad/i,
        android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
        android_tablet = /Android/i,
        amazon_phone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone = /IEMobile/i,
        windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
        other_blackberry = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera = /Opera Mini/i,
        other_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        seven_inch = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
        match = function (regex, userAgent) {
            return regex.test(userAgent)
        },
        IsMobileClass = function (userAgent) {
            var ua = userAgent || navigator.userAgent,
                tmp = ua.split("[FBAN");
            return "undefined" != typeof tmp[1] && (ua = tmp[0]), this.apple = {
                phone: match(apple_phone, ua),
                ipod: match(apple_ipod, ua),
                tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
                device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
            }, this.amazon = {
                phone: match(amazon_phone, ua),
                tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
                device: match(amazon_phone, ua) || match(amazon_tablet, ua)
            }, this.android = {
                phone: match(amazon_phone, ua) || match(android_phone, ua),
                tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
                device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
            }, this.windows = {
                phone: match(windows_phone, ua),
                tablet: match(windows_tablet, ua),
                device: match(windows_phone, ua) || match(windows_tablet, ua)
            }, this.other = {
                blackberry: match(other_blackberry, ua),
                blackberry10: match(other_blackberry_10, ua),
                opera: match(other_opera, ua),
                firefox: match(other_firefox, ua),
                chrome: match(other_chrome, ua),
                device: match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
            }, this.seven_inch = match(seven_inch, ua), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window ? this : void 0
        },
        instantiate = function () {
            var IM = new IsMobileClass;
            return IM.Class = IsMobileClass, IM
        };
    "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = IsMobileClass : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = instantiate() : "function" == typeof define && define.amd ? define("isMobile", [], global.isMobile = instantiate()) : global.isMobile = instantiate()
}(this),
function (factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], factory) : "undefined" != typeof exports ? module.exports = factory(require("jquery")) : factory(jQuery)
}(function ($) {
    "use strict";
    var Slick = window.Slick || {};
    Slick = function () {
        function Slick(element, settings) {
            var dataSettings, _ = this;
            _.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function (slider, i) {
                    return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + "</button>"
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, _.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, $.extend(_, _.initials), _.activeBreakpoint = null, _.animType = null, _.animProp = null, _.breakpoints = [], _.breakpointSettings = [], _.cssTransitions = !1, _.hidden = "hidden", _.paused = !1, _.positionProp = null, _.respondTo = null, _.rowCount = 1, _.shouldClick = !0, _.$slider = $(element), _.$slidesCache = null, _.transformType = null, _.transitionType = null, _.visibilityChange = "visibilitychange", _.windowWidth = 0, _.windowTimer = null, dataSettings = $(element).data("slick") || {}, _.options = $.extend({}, _.defaults, dataSettings, settings), _.currentSlide = _.options.initialSlide, _.originalSettings = _.options, "undefined" != typeof document.mozHidden ? (_.hidden = "mozHidden", _.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (_.hidden = "webkitHidden", _.visibilityChange = "webkitvisibilitychange"), _.autoPlay = $.proxy(_.autoPlay, _), _.autoPlayClear = $.proxy(_.autoPlayClear, _), _.changeSlide = $.proxy(_.changeSlide, _), _.clickHandler = $.proxy(_.clickHandler, _), _.selectHandler = $.proxy(_.selectHandler, _), _.setPosition = $.proxy(_.setPosition, _), _.swipeHandler = $.proxy(_.swipeHandler, _), _.dragHandler = $.proxy(_.dragHandler, _), _.keyHandler = $.proxy(_.keyHandler, _), _.autoPlayIterator = $.proxy(_.autoPlayIterator, _), _.instanceUid = instanceUid++, _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, _.registerBreakpoints(), _.init(!0), _.checkResponsive(!0)
        }
        var instanceUid = 0;
        return Slick
    }(), Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
        var _ = this;
        if ("boolean" == typeof index) addBefore = index, index = null;
        else if (0 > index || index >= _.slideCount) return !1;
        _.unload(), "number" == typeof index ? 0 === index && 0 === _.$slides.length ? $(markup).appendTo(_.$slideTrack) : addBefore ? $(markup).insertBefore(_.$slides.eq(index)) : $(markup).insertAfter(_.$slides.eq(index)) : addBefore === !0 ? $(markup).prependTo(_.$slideTrack) : $(markup).appendTo(_.$slideTrack), _.$slides = _.$slideTrack.children(this.options.slide), _.$slideTrack.children(this.options.slide).detach(), _.$slideTrack.append(_.$slides), _.$slides.each(function (index, element) {
            $(element).attr("data-slick-index", index)
        }), _.$slidesCache = _.$slides, _.reinit()
    }, Slick.prototype.animateHeight = function () {
        var _ = this;
        if (1 === _.options.slidesToShow && _.options.adaptiveHeight === !0 && _.options.vertical === !1) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(!0);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed)
        }
    }, Slick.prototype.animateSlide = function (targetLeft, callback) {
        var animProps = {},
            _ = this;
        _.animateHeight(), _.options.rtl === !0 && _.options.vertical === !1 && (targetLeft = -targetLeft), _.transformsEnabled === !1 ? _.options.vertical === !1 ? _.$slideTrack.animate({
            left: targetLeft
        }, _.options.speed, _.options.easing, callback) : _.$slideTrack.animate({
            top: targetLeft
        }, _.options.speed, _.options.easing, callback) : _.cssTransitions === !1 ? (_.options.rtl === !0 && (_.currentLeft = -_.currentLeft), $({
            animStart: _.currentLeft
        }).animate({
            animStart: targetLeft
        }, {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function (now) {
                now = Math.ceil(now), _.options.vertical === !1 ? (animProps[_.animType] = "translate(" + now + "px, 0px)", _.$slideTrack.css(animProps)) : (animProps[_.animType] = "translate(0px," + now + "px)", _.$slideTrack.css(animProps))
            },
            complete: function () {
                callback && callback.call()
            }
        })) : (_.applyTransition(), targetLeft = Math.ceil(targetLeft), _.options.vertical === !1 ? animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)" : animProps[_.animType] = "translate3d(0px," + targetLeft + "px, 0px)", _.$slideTrack.css(animProps), callback && setTimeout(function () {
            _.disableTransition(), callback.call()
        }, _.options.speed))
    }, Slick.prototype.asNavFor = function (index) {
        var _ = this,
            asNavFor = _.options.asNavFor;
        asNavFor && null !== asNavFor && (asNavFor = $(asNavFor).not(_.$slider)), null !== asNavFor && "object" == typeof asNavFor && asNavFor.each(function () {
            var target = $(this).slick("getSlick");
            target.unslicked || target.slideHandler(index, !0)
        })
    }, Slick.prototype.applyTransition = function (slide) {
        var _ = this,
            transition = {};
        _.options.fade === !1 ? transition[_.transitionType] = _.transformType + " " + _.options.speed + "ms " + _.options.cssEase : transition[_.transitionType] = "opacity " + _.options.speed + "ms " + _.options.cssEase, _.options.fade === !1 ? _.$slideTrack.css(transition) : _.$slides.eq(slide).css(transition)
    }, Slick.prototype.autoPlay = function () {
        var _ = this;
        _.autoPlayTimer && clearInterval(_.autoPlayTimer), _.slideCount > _.options.slidesToShow && _.paused !== !0 && (_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed))
    }, Slick.prototype.autoPlayClear = function () {
        var _ = this;
        _.autoPlayTimer && clearInterval(_.autoPlayTimer)
    }, Slick.prototype.autoPlayIterator = function () {
        var _ = this;
        _.options.infinite === !1 ? 1 === _.direction ? (_.currentSlide + 1 === _.slideCount - 1 && (_.direction = 0), _.slideHandler(_.currentSlide + _.options.slidesToScroll)) : (_.currentSlide - 1 === 0 && (_.direction = 1), _.slideHandler(_.currentSlide - _.options.slidesToScroll)) : _.slideHandler(_.currentSlide + _.options.slidesToScroll)
    }, Slick.prototype.buildArrows = function () {
        var _ = this;
        _.options.arrows === !0 && (_.$prevArrow = $(_.options.prevArrow).addClass("slick-arrow"), _.$nextArrow = $(_.options.nextArrow).addClass("slick-arrow"), _.slideCount > _.options.slidesToShow ? (_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), _.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.prependTo(_.options.appendArrows), _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.appendTo(_.options.appendArrows), _.options.infinite !== !0 && _.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : _.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, Slick.prototype.buildDots = function () {
        var i, dotString, _ = this;
        if (_.options.dots === !0 && _.slideCount > _.options.slidesToShow) {
            for (dotString = '<ul class="' + _.options.dotsClass + '">', i = 0; i <= _.getDotCount(); i += 1) dotString += "<li>" + _.options.customPaging.call(this, _, i) + "</li>";
            dotString += "</ul>", _.$dots = $(dotString).appendTo(_.options.appendDots), _.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
        }
    }, Slick.prototype.buildOut = function () {
        var _ = this;
        _.$slides = _.$slider.children(_.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), _.slideCount = _.$slides.length, _.$slides.each(function (index, element) {
            $(element).attr("data-slick-index", index).data("originalStyling", $(element).attr("style") || "")
        }), _.$slidesCache = _.$slides, _.$slider.addClass("slick-slider"), _.$slideTrack = 0 === _.slideCount ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent(), _.$list = _.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), _.$slideTrack.css("opacity", 0), (_.options.centerMode === !0 || _.options.swipeToSlide === !0) && (_.options.slidesToScroll = 1), $("img[data-lazy]", _.$slider).not("[src]").addClass("slick-loading"), _.setupInfinite(), _.buildArrows(), _.buildDots(), _.updateDots(), _.setSlideClasses("number" == typeof _.currentSlide ? _.currentSlide : 0), _.options.draggable === !0 && _.$list.addClass("draggable")
    }, Slick.prototype.buildRows = function () {
        var a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection, _ = this;
        if (newSlides = document.createDocumentFragment(), originalSlides = _.$slider.children(), _.options.rows > 1) {
            for (slidesPerSection = _.options.slidesPerRow * _.options.rows, numOfSlides = Math.ceil(originalSlides.length / slidesPerSection), a = 0; numOfSlides > a; a++) {
                var slide = document.createElement("div");
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement("div");
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
                        originalSlides.get(target) && row.appendChild(originalSlides.get(target))
                    }
                    slide.appendChild(row)
                }
                newSlides.appendChild(slide)
            }
            _.$slider.html(newSlides), _.$slider.children().children().children().css({
                width: 100 / _.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, Slick.prototype.checkResponsive = function (initial, forceUpdate) {
        var breakpoint, targetBreakpoint, respondToWidth, _ = this,
            triggerBreakpoint = !1,
            sliderWidth = _.$slider.width(),
            windowWidth = window.innerWidth || $(window).width();
        if ("window" === _.respondTo ? respondToWidth = windowWidth : "slider" === _.respondTo ? respondToWidth = sliderWidth : "min" === _.respondTo && (respondToWidth = Math.min(windowWidth, sliderWidth)), _.options.responsive && _.options.responsive.length && null !== _.options.responsive) {
            targetBreakpoint = null;
            for (breakpoint in _.breakpoints) _.breakpoints.hasOwnProperty(breakpoint) && (_.originalSettings.mobileFirst === !1 ? respondToWidth < _.breakpoints[breakpoint] && (targetBreakpoint = _.breakpoints[breakpoint]) : respondToWidth > _.breakpoints[breakpoint] && (targetBreakpoint = _.breakpoints[breakpoint]));
            null !== targetBreakpoint ? null !== _.activeBreakpoint ? (targetBreakpoint !== _.activeBreakpoint || forceUpdate) && (_.activeBreakpoint = targetBreakpoint, "unslick" === _.breakpointSettings[targetBreakpoint] ? _.unslick(targetBreakpoint) : (_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]), initial === !0 && (_.currentSlide = _.options.initialSlide), _.refresh(initial)), triggerBreakpoint = targetBreakpoint) : (_.activeBreakpoint = targetBreakpoint, "unslick" === _.breakpointSettings[targetBreakpoint] ? _.unslick(targetBreakpoint) : (_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]), initial === !0 && (_.currentSlide = _.options.initialSlide), _.refresh(initial)), triggerBreakpoint = targetBreakpoint) : null !== _.activeBreakpoint && (_.activeBreakpoint = null, _.options = _.originalSettings, initial === !0 && (_.currentSlide = _.options.initialSlide), _.refresh(initial), triggerBreakpoint = targetBreakpoint), initial || triggerBreakpoint === !1 || _.$slider.trigger("breakpoint", [_, triggerBreakpoint])
        }
    }, Slick.prototype.changeSlide = function (event, dontAnimate) {
        var indexOffset, slideOffset, unevenOffset, _ = this,
            $target = $(event.target);
        switch ($target.is("a") && event.preventDefault(), $target.is("li") || ($target = $target.closest("li")), unevenOffset = _.slideCount % _.options.slidesToScroll !== 0, indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll, event.data.message) {
        case "previous":
            slideOffset = 0 === indexOffset ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset, _.slideCount > _.options.slidesToShow && _.slideHandler(_.currentSlide - slideOffset, !1, dontAnimate);
            break;
        case "next":
            slideOffset = 0 === indexOffset ? _.options.slidesToScroll : indexOffset, _.slideCount > _.options.slidesToShow && _.slideHandler(_.currentSlide + slideOffset, !1, dontAnimate);
            break;
        case "index":
            var index = 0 === event.data.index ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;
            _.slideHandler(_.checkNavigable(index), !1, dontAnimate), $target.children().trigger("focus");
            break;
        default:
            return
        }
    }, Slick.prototype.checkNavigable = function (index) {
        var navigables, prevNavigable, _ = this;
        if (navigables = _.getNavigableIndexes(), prevNavigable = 0, index > navigables[navigables.length - 1]) index = navigables[navigables.length - 1];
        else
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break
                }
                prevNavigable = navigables[n]
            }
        return index
    }, Slick.prototype.cleanUpEvents = function () {
        var _ = this;
        _.options.dots && null !== _.$dots && ($("li", _.$dots).off("click.slick", _.changeSlide), _.options.pauseOnDotsHover === !0 && _.options.autoplay === !0 && $("li", _.$dots).off("mouseenter.slick", $.proxy(_.setPaused, _, !0)).off("mouseleave.slick", $.proxy(_.setPaused, _, !1))), _.options.arrows === !0 && _.slideCount > _.options.slidesToShow && (_.$prevArrow && _.$prevArrow.off("click.slick", _.changeSlide), _.$nextArrow && _.$nextArrow.off("click.slick", _.changeSlide)), _.$list.off("touchstart.slick mousedown.slick", _.swipeHandler), _.$list.off("touchmove.slick mousemove.slick", _.swipeHandler), _.$list.off("touchend.slick mouseup.slick", _.swipeHandler), _.$list.off("touchcancel.slick mouseleave.slick", _.swipeHandler), _.$list.off("click.slick", _.clickHandler), $(document).off(_.visibilityChange, _.visibility), _.$list.off("mouseenter.slick", $.proxy(_.setPaused, _, !0)), _.$list.off("mouseleave.slick", $.proxy(_.setPaused, _, !1)), _.options.accessibility === !0 && _.$list.off("keydown.slick", _.keyHandler), _.options.focusOnSelect === !0 && $(_.$slideTrack).children().off("click.slick", _.selectHandler), $(window).off("orientationchange.slick.slick-" + _.instanceUid, _.orientationChange), $(window).off("resize.slick.slick-" + _.instanceUid, _.resize), $("[draggable!=true]", _.$slideTrack).off("dragstart", _.preventDefault), $(window).off("load.slick.slick-" + _.instanceUid, _.setPosition), $(document).off("ready.slick.slick-" + _.instanceUid, _.setPosition)
    }, Slick.prototype.cleanUpRows = function () {
        var originalSlides, _ = this;
        _.options.rows > 1 && (originalSlides = _.$slides.children().children(), originalSlides.removeAttr("style"), _.$slider.html(originalSlides))
    }, Slick.prototype.clickHandler = function (event) {
        var _ = this;
        _.shouldClick === !1 && (event.stopImmediatePropagation(), event.stopPropagation(), event.preventDefault())
    }, Slick.prototype.destroy = function (refresh) {
        var _ = this;
        _.autoPlayClear(), _.touchObject = {}, _.cleanUpEvents(), $(".slick-cloned", _.$slider).detach(), _.$dots && _.$dots.remove(), _.$prevArrow && _.$prevArrow.length && (_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.remove()), _.$nextArrow && _.$nextArrow.length && (_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.remove()), _.$slides && (_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
            $(this).attr("style", $(this).data("originalStyling"))
        }), _.$slideTrack.children(this.options.slide).detach(), _.$slideTrack.detach(), _.$list.detach(), _.$slider.append(_.$slides)), _.cleanUpRows(), _.$slider.removeClass("slick-slider"), _.$slider.removeClass("slick-initialized"), _.unslicked = !0, refresh || _.$slider.trigger("destroy", [_])
    }, Slick.prototype.disableTransition = function (slide) {
        var _ = this,
            transition = {};
        transition[_.transitionType] = "", _.options.fade === !1 ? _.$slideTrack.css(transition) : _.$slides.eq(slide).css(transition)
    }, Slick.prototype.fadeSlide = function (slideIndex, callback) {
        var _ = this;
        _.cssTransitions === !1 ? (_.$slides.eq(slideIndex).css({
            zIndex: _.options.zIndex
        }), _.$slides.eq(slideIndex).animate({
            opacity: 1
        }, _.options.speed, _.options.easing, callback)) : (_.applyTransition(slideIndex), _.$slides.eq(slideIndex).css({
            opacity: 1,
            zIndex: _.options.zIndex
        }), callback && setTimeout(function () {
            _.disableTransition(slideIndex), callback.call()
        }, _.options.speed))
    }, Slick.prototype.fadeSlideOut = function (slideIndex) {
        var _ = this;
        _.cssTransitions === !1 ? _.$slides.eq(slideIndex).animate({
            opacity: 0,
            zIndex: _.options.zIndex - 2
        }, _.options.speed, _.options.easing) : (_.applyTransition(slideIndex), _.$slides.eq(slideIndex).css({
            opacity: 0,
            zIndex: _.options.zIndex - 2
        }))
    }, Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
        var _ = this;
        null !== filter && (_.unload(), _.$slideTrack.children(this.options.slide).detach(), _.$slidesCache.filter(filter).appendTo(_.$slideTrack), _.reinit())
    }, Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
        var _ = this;
        return _.currentSlide
    }, Slick.prototype.getDotCount = function () {
        var _ = this,
            breakPoint = 0,
            counter = 0,
            pagerQty = 0;
        if (_.options.infinite === !0)
            for (; breakPoint < _.slideCount;) ++pagerQty, breakPoint = counter + _.options.slidesToShow, counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        else if (_.options.centerMode === !0) pagerQty = _.slideCount;
        else
            for (; breakPoint < _.slideCount;) ++pagerQty, breakPoint = counter + _.options.slidesToShow, counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        return pagerQty - 1
    }, Slick.prototype.getLeft = function (slideIndex) {
        var targetLeft, verticalHeight, targetSlide, _ = this,
            verticalOffset = 0;
        return _.slideOffset = 0, verticalHeight = _.$slides.first().outerHeight(!0), _.options.infinite === !0 ? (_.slideCount > _.options.slidesToShow && (_.slideOffset = _.slideWidth * _.options.slidesToShow * -1, verticalOffset = verticalHeight * _.options.slidesToShow * -1), _.slideCount % _.options.slidesToScroll !== 0 && slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow && (slideIndex > _.slideCount ? (_.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1, verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1) : (_.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1, verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1))) : slideIndex + _.options.slidesToShow > _.slideCount && (_.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth, verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight), _.slideCount <= _.options.slidesToShow && (_.slideOffset = 0, verticalOffset = 0), _.options.centerMode === !0 && _.options.infinite === !0 ? _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth : _.options.centerMode === !0 && (_.slideOffset = 0, _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2)), targetLeft = _.options.vertical === !1 ? slideIndex * _.slideWidth * -1 + _.slideOffset : slideIndex * verticalHeight * -1 + verticalOffset, _.options.variableWidth === !0 && (targetSlide = _.slideCount <= _.options.slidesToShow || _.options.infinite === !1 ? _.$slideTrack.children(".slick-slide").eq(slideIndex) : _.$slideTrack.children(".slick-slide").eq(slideIndex + _.options.slidesToShow), targetLeft = targetSlide[0] ? -1 * targetSlide[0].offsetLeft : 0, _.options.centerMode === !0 && (targetSlide = _.options.infinite === !1 ? _.$slideTrack.children(".slick-slide").eq(slideIndex) : _.$slideTrack.children(".slick-slide").eq(slideIndex + _.options.slidesToShow + 1), targetLeft = targetSlide[0] ? -1 * targetSlide[0].offsetLeft : 0, targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2)), targetLeft
    }, Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
        var _ = this;
        return _.options[option]
    }, Slick.prototype.getNavigableIndexes = function () {
        var max, _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [];
        for (_.options.infinite === !1 ? max = _.slideCount : (breakPoint = -1 * _.options.slidesToScroll, counter = -1 * _.options.slidesToScroll, max = 2 * _.slideCount); max > breakPoint;) indexes.push(breakPoint), breakPoint = counter + _.options.slidesToScroll, counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        return indexes
    }, Slick.prototype.getSlick = function () {
        return this
    }, Slick.prototype.getSlideCount = function () {
        var slidesTraversed, swipedSlide, centerOffset, _ = this;
        return centerOffset = _.options.centerMode === !0 ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0, _.options.swipeToSlide === !0 ? (_.$slideTrack.find(".slick-slide").each(function (index, slide) {
            return slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > -1 * _.swipeLeft ? (swipedSlide = slide, !1) : void 0
        }), slidesTraversed = Math.abs($(swipedSlide).attr("data-slick-index") - _.currentSlide) || 1) : _.options.slidesToScroll
    }, Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
        var _ = this;
        _.changeSlide({
            data: {
                message: "index",
                index: parseInt(slide)
            }
        }, dontAnimate)
    }, Slick.prototype.init = function (creation) {
        var _ = this;
        $(_.$slider).hasClass("slick-initialized") || ($(_.$slider).addClass("slick-initialized"), _.buildRows(), _.buildOut(), _.setProps(), _.startLoad(), _.loadSlider(), _.initializeEvents(), _.updateArrows(), _.updateDots()), creation && _.$slider.trigger("init", [_]), _.options.accessibility === !0 && _.initADA()
    }, Slick.prototype.initArrowEvents = function () {
        var _ = this;
        _.options.arrows === !0 && _.slideCount > _.options.slidesToShow && (_.$prevArrow.on("click.slick", {
            message: "previous"
        }, _.changeSlide), _.$nextArrow.on("click.slick", {
            message: "next"
        }, _.changeSlide))
    }, Slick.prototype.initDotEvents = function () {
        var _ = this;
        _.options.dots === !0 && _.slideCount > _.options.slidesToShow && $("li", _.$dots).on("click.slick", {
            message: "index"
        }, _.changeSlide), _.options.dots === !0 && _.options.pauseOnDotsHover === !0 && _.options.autoplay === !0 && $("li", _.$dots).on("mouseenter.slick", $.proxy(_.setPaused, _, !0)).on("mouseleave.slick", $.proxy(_.setPaused, _, !1))
    }, Slick.prototype.initializeEvents = function () {
        var _ = this;
        _.initArrowEvents(), _.initDotEvents(), _.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, _.swipeHandler), _.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, _.swipeHandler), _.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, _.swipeHandler), _.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, _.swipeHandler), _.$list.on("click.slick", _.clickHandler), $(document).on(_.visibilityChange, $.proxy(_.visibility, _)), _.$list.on("mouseenter.slick", $.proxy(_.setPaused, _, !0)), _.$list.on("mouseleave.slick", $.proxy(_.setPaused, _, !1)), _.options.accessibility === !0 && _.$list.on("keydown.slick", _.keyHandler), _.options.focusOnSelect === !0 && $(_.$slideTrack).children().on("click.slick", _.selectHandler), $(window).on("orientationchange.slick.slick-" + _.instanceUid, $.proxy(_.orientationChange, _)), $(window).on("resize.slick.slick-" + _.instanceUid, $.proxy(_.resize, _)), $("[draggable!=true]", _.$slideTrack).on("dragstart", _.preventDefault), $(window).on("load.slick.slick-" + _.instanceUid, _.setPosition), $(document).on("ready.slick.slick-" + _.instanceUid, _.setPosition)
    }, Slick.prototype.initUI = function () {
        var _ = this;
        _.options.arrows === !0 && _.slideCount > _.options.slidesToShow && (_.$prevArrow.show(), _.$nextArrow.show()), _.options.dots === !0 && _.slideCount > _.options.slidesToShow && _.$dots.show(), _.options.autoplay === !0 && _.autoPlay()
    }, Slick.prototype.keyHandler = function (event) {
        var _ = this;
        event.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === event.keyCode && _.options.accessibility === !0 ? _.changeSlide({
            data: {
                message: "previous"
            }
        }) : 39 === event.keyCode && _.options.accessibility === !0 && _.changeSlide({
            data: {
                message: "next"
            }
        }))
    }, Slick.prototype.lazyLoad = function () {
        function loadImages(imagesScope) {
            $("img[data-lazy]", imagesScope).each(function () {
                var image = $(this),
                    imageSource = $(this).attr("data-lazy"),
                    imageToLoad = document.createElement("img");
                imageToLoad.onload = function () {
                    image.animate({
                        opacity: 0
                    }, 100, function () {
                        image.attr("src", imageSource).animate({
                            opacity: 1
                        }, 200, function () {
                            image.removeAttr("data-lazy").removeClass("slick-loading")
                        })
                    })
                }, imageToLoad.src = imageSource
            })
        }
        var loadRange, cloneRange, rangeStart, rangeEnd, _ = this;
        _.options.centerMode === !0 ? _.options.infinite === !0 ? (rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1), rangeEnd = rangeStart + _.options.slidesToShow + 2) : (rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1)), rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide) : (rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide, rangeEnd = rangeStart + _.options.slidesToShow, _.options.fade === !0 && (rangeStart > 0 && rangeStart--, rangeEnd <= _.slideCount && rangeEnd++)), loadRange = _.$slider.find(".slick-slide").slice(rangeStart, rangeEnd), loadImages(loadRange), _.slideCount <= _.options.slidesToShow ? (cloneRange = _.$slider.find(".slick-slide"), loadImages(cloneRange)) : _.currentSlide >= _.slideCount - _.options.slidesToShow ? (cloneRange = _.$slider.find(".slick-cloned").slice(0, _.options.slidesToShow), loadImages(cloneRange)) : 0 === _.currentSlide && (cloneRange = _.$slider.find(".slick-cloned").slice(-1 * _.options.slidesToShow), loadImages(cloneRange))
    }, Slick.prototype.loadSlider = function () {
        var _ = this;
        _.setPosition(), _.$slideTrack.css({
            opacity: 1
        }), _.$slider.removeClass("slick-loading"), _.initUI(), "progressive" === _.options.lazyLoad && _.progressiveLazyLoad()
    }, Slick.prototype.next = Slick.prototype.slickNext = function () {
        var _ = this;
        _.changeSlide({
            data: {
                message: "next"
            }
        })
    }, Slick.prototype.orientationChange = function () {
        var _ = this;
        _.checkResponsive(), _.setPosition()
    }, Slick.prototype.pause = Slick.prototype.slickPause = function () {
        var _ = this;
        _.autoPlayClear(), _.paused = !0
    }, Slick.prototype.play = Slick.prototype.slickPlay = function () {
        var _ = this;
        _.paused = !1, _.autoPlay()
    }, Slick.prototype.postSlide = function (index) {
        var _ = this;
        _.$slider.trigger("afterChange", [_, index]), _.animating = !1, _.setPosition(), _.swipeLeft = null, _.options.autoplay === !0 && _.paused === !1 && _.autoPlay(), _.options.accessibility === !0 && _.initADA()
    }, Slick.prototype.prev = Slick.prototype.slickPrev = function () {
        var _ = this;
        _.changeSlide({
            data: {
                message: "previous"
            }
        })
    }, Slick.prototype.preventDefault = function (event) {
        event.preventDefault()
    }, Slick.prototype.progressiveLazyLoad = function () {
        var imgCount, targetImage, _ = this;
        imgCount = $("img[data-lazy]", _.$slider).length, imgCount > 0 && (targetImage = $("img[data-lazy]", _.$slider).first(), targetImage.attr("src", targetImage.attr("data-lazy")).removeClass("slick-loading").load(function () {
            targetImage.removeAttr("data-lazy"), _.progressiveLazyLoad(), _.options.adaptiveHeight === !0 && _.setPosition()
        }).error(function () {
            targetImage.removeAttr("data-lazy"), _.progressiveLazyLoad()
        }))
    }, Slick.prototype.refresh = function (initializing) {
        var _ = this,
            currentSlide = _.currentSlide;
        _.destroy(!0), $.extend(_, _.initials, {
            currentSlide: currentSlide
        }), _.init(), initializing || _.changeSlide({
            data: {
                message: "index",
                index: currentSlide
            }
        }, !1)
    }, Slick.prototype.registerBreakpoints = function () {
        var breakpoint, currentBreakpoint, l, _ = this,
            responsiveSettings = _.options.responsive || null;
        if ("array" === $.type(responsiveSettings) && responsiveSettings.length) {
            _.respondTo = _.options.respondTo || "window";
            for (breakpoint in responsiveSettings)
                if (l = _.breakpoints.length - 1, currentBreakpoint = responsiveSettings[breakpoint].breakpoint, responsiveSettings.hasOwnProperty(breakpoint)) {
                    for (; l >= 0;) _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint && _.breakpoints.splice(l, 1), l--;
                    _.breakpoints.push(currentBreakpoint), _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings
                }
            _.breakpoints.sort(function (a, b) {
                return _.options.mobileFirst ? a - b : b - a
            })
        }
    }, Slick.prototype.reinit = function () {
        var _ = this;
        _.$slides = _.$slideTrack.children(_.options.slide).addClass("slick-slide"), _.slideCount = _.$slides.length, _.currentSlide >= _.slideCount && 0 !== _.currentSlide && (_.currentSlide = _.currentSlide - _.options.slidesToScroll), _.slideCount <= _.options.slidesToShow && (_.currentSlide = 0), _.registerBreakpoints(), _.setProps(), _.setupInfinite(), _.buildArrows(), _.updateArrows(), _.initArrowEvents(), _.buildDots(), _.updateDots(), _.initDotEvents(), _.checkResponsive(!1, !0), _.options.focusOnSelect === !0 && $(_.$slideTrack).children().on("click.slick", _.selectHandler), _.setSlideClasses(0), _.setPosition(), _.$slider.trigger("reInit", [_]), _.options.autoplay === !0 && _.focusHandler()
    }, Slick.prototype.resize = function () {
        var _ = this;
        $(window).width() !== _.windowWidth && (clearTimeout(_.windowDelay), _.windowDelay = window.setTimeout(function () {
            _.windowWidth = $(window).width(), _.checkResponsive(), _.unslicked || _.setPosition()
        }, 50))
    }, Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
        var _ = this;
        return "boolean" == typeof index ? (removeBefore = index, index = removeBefore === !0 ? 0 : _.slideCount - 1) : index = removeBefore === !0 ? --index : index, _.slideCount < 1 || 0 > index || index > _.slideCount - 1 ? !1 : (_.unload(), removeAll === !0 ? _.$slideTrack.children().remove() : _.$slideTrack.children(this.options.slide).eq(index).remove(), _.$slides = _.$slideTrack.children(this.options.slide), _.$slideTrack.children(this.options.slide).detach(), _.$slideTrack.append(_.$slides), _.$slidesCache = _.$slides, void _.reinit())
    }, Slick.prototype.setCSS = function (position) {
        var x, y, _ = this,
            positionProps = {};
        _.options.rtl === !0 && (position = -position), x = "left" == _.positionProp ? Math.ceil(position) + "px" : "0px", y = "top" == _.positionProp ? Math.ceil(position) + "px" : "0px", positionProps[_.positionProp] = position, _.transformsEnabled === !1 ? _.$slideTrack.css(positionProps) : (positionProps = {}, _.cssTransitions === !1 ? (positionProps[_.animType] = "translate(" + x + ", " + y + ")", _.$slideTrack.css(positionProps)) : (positionProps[_.animType] = "translate3d(" + x + ", " + y + ", 0px)", _.$slideTrack.css(positionProps)))
    }, Slick.prototype.setDimensions = function () {
        var _ = this;
        _.options.vertical === !1 ? _.options.centerMode === !0 && _.$list.css({
            padding: "0px " + _.options.centerPadding
        }) : (_.$list.height(_.$slides.first().outerHeight(!0) * _.options.slidesToShow), _.options.centerMode === !0 && _.$list.css({
            padding: _.options.centerPadding + " 0px"
        })), _.listWidth = _.$list.width(), _.listHeight = _.$list.height(), _.options.vertical === !1 && _.options.variableWidth === !1 ? (_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow), _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children(".slick-slide").length))) : _.options.variableWidth === !0 ? _.$slideTrack.width(5e3 * _.slideCount) : (_.slideWidth = Math.ceil(_.listWidth), _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(!0) * _.$slideTrack.children(".slick-slide").length)));
        var offset = _.$slides.first().outerWidth(!0) - _.$slides.first().width();
        _.options.variableWidth === !1 && _.$slideTrack.children(".slick-slide").width(_.slideWidth - offset)
    }, Slick.prototype.setFade = function () {
        var targetLeft, _ = this;
        _.$slides.each(function (index, element) {
            targetLeft = _.slideWidth * index * -1, _.options.rtl === !0 ? $(element).css({
                position: "relative",
                right: targetLeft,
                top: 0,
                zIndex: _.options.zIndex - 2,
                opacity: 0
            }) : $(element).css({
                position: "relative",
                left: targetLeft,
                top: 0,
                zIndex: _.options.zIndex - 2,
                opacity: 0
            })
        }), _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        })
    }, Slick.prototype.setHeight = function () {
        var _ = this;
        if (1 === _.options.slidesToShow && _.options.adaptiveHeight === !0 && _.options.vertical === !1) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(!0);
            _.$list.css("height", targetHeight)
        }
    }, Slick.prototype.setOption = Slick.prototype.slickSetOption = function (option, value, refresh) {
        var l, item, _ = this;
        if ("responsive" === option && "array" === $.type(value))
            for (item in value)
                if ("array" !== $.type(_.options.responsive)) _.options.responsive = [value[item]];
                else {
                    for (l = _.options.responsive.length - 1; l >= 0;) _.options.responsive[l].breakpoint === value[item].breakpoint && _.options.responsive.splice(l, 1), l--;
                    _.options.responsive.push(value[item])
                } else _.options[option] = value;
        refresh === !0 && (_.unload(), _.reinit())
    }, Slick.prototype.setPosition = function () {
        var _ = this;
        _.setDimensions(), _.setHeight(), _.options.fade === !1 ? _.setCSS(_.getLeft(_.currentSlide)) : _.setFade(), _.$slider.trigger("setPosition", [_])
    }, Slick.prototype.setProps = function () {
        var _ = this,
            bodyStyle = document.body.style;
        _.positionProp = _.options.vertical === !0 ? "top" : "left", "top" === _.positionProp ? _.$slider.addClass("slick-vertical") : _.$slider.removeClass("slick-vertical"), (void 0 !== bodyStyle.WebkitTransition || void 0 !== bodyStyle.MozTransition || void 0 !== bodyStyle.msTransition) && _.options.useCSS === !0 && (_.cssTransitions = !0), _.options.fade && ("number" == typeof _.options.zIndex ? _.options.zIndex < 3 && (_.options.zIndex = 3) : _.options.zIndex = _.defaults.zIndex), void 0 !== bodyStyle.OTransform && (_.animType = "OTransform", _.transformType = "-o-transform", _.transitionType = "OTransition", void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.webkitPerspective && (_.animType = !1)), void 0 !== bodyStyle.MozTransform && (_.animType = "MozTransform", _.transformType = "-moz-transform", _.transitionType = "MozTransition", void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.MozPerspective && (_.animType = !1)), void 0 !== bodyStyle.webkitTransform && (_.animType = "webkitTransform", _.transformType = "-webkit-transform", _.transitionType = "webkitTransition", void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.webkitPerspective && (_.animType = !1)), void 0 !== bodyStyle.msTransform && (_.animType = "msTransform", _.transformType = "-ms-transform", _.transitionType = "msTransition", void 0 === bodyStyle.msTransform && (_.animType = !1)), void 0 !== bodyStyle.transform && _.animType !== !1 && (_.animType = "transform", _.transformType = "transform", _.transitionType = "transition"), _.transformsEnabled = null !== _.animType && _.animType !== !1
    }, Slick.prototype.setSlideClasses = function (index) {
        var centerOffset, allSlides, indexOffset, remainder, _ = this;
        allSlides = _.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), _.$slides.eq(index).addClass("slick-current"), _.options.centerMode === !0 ? (centerOffset = Math.floor(_.options.slidesToShow / 2), _.options.infinite === !0 && (index >= centerOffset && index <= _.slideCount - 1 - centerOffset ? _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass("slick-active").attr("aria-hidden", "false") : (indexOffset = _.options.slidesToShow + index, allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === index ? allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass("slick-center") : index === _.slideCount - 1 && allSlides.eq(_.options.slidesToShow).addClass("slick-center")), _.$slides.eq(index).addClass("slick-center")) : index >= 0 && index <= _.slideCount - _.options.slidesToShow ? _.$slides.slice(index, index + _.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : allSlides.length <= _.options.slidesToShow ? allSlides.addClass("slick-active").attr("aria-hidden", "false") : (remainder = _.slideCount % _.options.slidesToShow, indexOffset = _.options.infinite === !0 ? _.options.slidesToShow + index : index, _.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow ? allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass("slick-active").attr("aria-hidden", "false") : allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === _.options.lazyLoad && _.lazyLoad()
    }, Slick.prototype.setupInfinite = function () {
        var i, slideIndex, infiniteCount, _ = this;
        if (_.options.fade === !0 && (_.options.centerMode = !1), _.options.infinite === !0 && _.options.fade === !1 && (slideIndex = null, _.slideCount > _.options.slidesToShow)) {
            for (infiniteCount = _.options.centerMode === !0 ? _.options.slidesToShow + 1 : _.options.slidesToShow, i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) slideIndex = i - 1, $(_.$slides[slideIndex]).clone(!0).attr("id", "").attr("data-slick-index", slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned");
            for (i = 0; infiniteCount > i; i += 1) slideIndex = i, $(_.$slides[slideIndex]).clone(!0).attr("id", "").attr("data-slick-index", slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned");
            _.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
                $(this).attr("id", "")
            })
        }
    }, Slick.prototype.setPaused = function (paused) {
        var _ = this;
        _.options.autoplay === !0 && _.options.pauseOnHover === !0 && (_.paused = paused, paused ? _.autoPlayClear() : _.autoPlay())
    }, Slick.prototype.selectHandler = function (event) {
        var _ = this,
            targetElement = $(event.target).is(".slick-slide") ? $(event.target) : $(event.target).parents(".slick-slide"),
            index = parseInt(targetElement.attr("data-slick-index"));
        return index || (index = 0), _.slideCount <= _.options.slidesToShow ? (_.setSlideClasses(index), void _.asNavFor(index)) : void _.slideHandler(index)
    }, Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this;
        return sync = sync || !1, _.animating === !0 && _.options.waitForAnimate === !0 || _.options.fade === !0 && _.currentSlide === index || _.slideCount <= _.options.slidesToShow ? void 0 : (sync === !1 && _.asNavFor(index), targetSlide = index, targetLeft = _.getLeft(targetSlide), slideLeft = _.getLeft(_.currentSlide), _.currentLeft = null === _.swipeLeft ? slideLeft : _.swipeLeft, _.options.infinite === !1 && _.options.centerMode === !1 && (0 > index || index > _.getDotCount() * _.options.slidesToScroll) ? void(_.options.fade === !1 && (targetSlide = _.currentSlide, dontAnimate !== !0 ? _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide)
        }) : _.postSlide(targetSlide))) : _.options.infinite === !1 && _.options.centerMode === !0 && (0 > index || index > _.slideCount - _.options.slidesToScroll) ? void(_.options.fade === !1 && (targetSlide = _.currentSlide, dontAnimate !== !0 ? _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide)
        }) : _.postSlide(targetSlide))) : (_.options.autoplay === !0 && clearInterval(_.autoPlayTimer), animSlide = 0 > targetSlide ? _.slideCount % _.options.slidesToScroll !== 0 ? _.slideCount - _.slideCount % _.options.slidesToScroll : _.slideCount + targetSlide : targetSlide >= _.slideCount ? _.slideCount % _.options.slidesToScroll !== 0 ? 0 : targetSlide - _.slideCount : targetSlide, _.animating = !0, _.$slider.trigger("beforeChange", [_, _.currentSlide, animSlide]), oldSlide = _.currentSlide, _.currentSlide = animSlide, _.setSlideClasses(_.currentSlide), _.updateDots(), _.updateArrows(), _.options.fade === !0 ? (dontAnimate !== !0 ? (_.fadeSlideOut(oldSlide), _.fadeSlide(animSlide, function () {
            _.postSlide(animSlide)
        })) : _.postSlide(animSlide), void _.animateHeight()) : void(dontAnimate !== !0 ? _.animateSlide(targetLeft, function () {
            _.postSlide(animSlide)
        }) : _.postSlide(animSlide))))
    }, Slick.prototype.startLoad = function () {
        var _ = this;
        _.options.arrows === !0 && _.slideCount > _.options.slidesToShow && (_.$prevArrow.hide(), _.$nextArrow.hide()), _.options.dots === !0 && _.slideCount > _.options.slidesToShow && _.$dots.hide(), _.$slider.addClass("slick-loading")
    }, Slick.prototype.swipeDirection = function () {
        var xDist, yDist, r, swipeAngle, _ = this;
        return xDist = _.touchObject.startX - _.touchObject.curX, yDist = _.touchObject.startY - _.touchObject.curY, r = Math.atan2(yDist, xDist), swipeAngle = Math.round(180 * r / Math.PI), 0 > swipeAngle && (swipeAngle = 360 - Math.abs(swipeAngle)), 45 >= swipeAngle && swipeAngle >= 0 ? _.options.rtl === !1 ? "left" : "right" : 360 >= swipeAngle && swipeAngle >= 315 ? _.options.rtl === !1 ? "left" : "right" : swipeAngle >= 135 && 225 >= swipeAngle ? _.options.rtl === !1 ? "right" : "left" : _.options.verticalSwiping === !0 ? swipeAngle >= 35 && 135 >= swipeAngle ? "left" : "right" : "vertical"
    }, Slick.prototype.swipeEnd = function (event) {
        var slideCount, _ = this;
        if (_.dragging = !1, _.shouldClick = _.touchObject.swipeLength > 10 ? !1 : !0, void 0 === _.touchObject.curX) return !1;
        if (_.touchObject.edgeHit === !0 && _.$slider.trigger("edge", [_, _.swipeDirection()]), _.touchObject.swipeLength >= _.touchObject.minSwipe) switch (_.swipeDirection()) {
        case "left":
            slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount(), _.slideHandler(slideCount), _.currentDirection = 0, _.touchObject = {}, _.$slider.trigger("swipe", [_, "left"]);
            break;
        case "right":
            slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount(), _.slideHandler(slideCount), _.currentDirection = 1, _.touchObject = {}, _.$slider.trigger("swipe", [_, "right"])
        } else _.touchObject.startX !== _.touchObject.curX && (_.slideHandler(_.currentSlide), _.touchObject = {})
    }, Slick.prototype.swipeHandler = function (event) {
        var _ = this;
        if (!(_.options.swipe === !1 || "ontouchend" in document && _.options.swipe === !1 || _.options.draggable === !1 && -1 !== event.type.indexOf("mouse"))) switch (_.touchObject.fingerCount = event.originalEvent && void 0 !== event.originalEvent.touches ? event.originalEvent.touches.length : 1, _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold, _.options.verticalSwiping === !0 && (_.touchObject.minSwipe = _.listHeight / _.options.touchThreshold), event.data.action) {
        case "start":
            _.swipeStart(event);
            break;
        case "move":
            _.swipeMove(event);
            break;
        case "end":
            _.swipeEnd(event)
        }
    }, Slick.prototype.swipeMove = function (event) {
        var curLeft, swipeDirection, swipeLength, positionOffset, touches, _ = this;
        return touches = void 0 !== event.originalEvent ? event.originalEvent.touches : null, !_.dragging || touches && 1 !== touches.length ? !1 : (curLeft = _.getLeft(_.currentSlide), _.touchObject.curX = void 0 !== touches ? touches[0].pageX : event.clientX, _.touchObject.curY = void 0 !== touches ? touches[0].pageY : event.clientY, _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))), _.options.verticalSwiping === !0 && (_.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)))), swipeDirection = _.swipeDirection(), "vertical" !== swipeDirection ? (void 0 !== event.originalEvent && _.touchObject.swipeLength > 4 && event.preventDefault(), positionOffset = (_.options.rtl === !1 ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1), _.options.verticalSwiping === !0 && (positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1), swipeLength = _.touchObject.swipeLength, _.touchObject.edgeHit = !1, _.options.infinite === !1 && (0 === _.currentSlide && "right" === swipeDirection || _.currentSlide >= _.getDotCount() && "left" === swipeDirection) && (swipeLength = _.touchObject.swipeLength * _.options.edgeFriction, _.touchObject.edgeHit = !0), _.options.vertical === !1 ? _.swipeLeft = curLeft + swipeLength * positionOffset : _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset, _.options.verticalSwiping === !0 && (_.swipeLeft = curLeft + swipeLength * positionOffset), _.options.fade === !0 || _.options.touchMove === !1 ? !1 : _.animating === !0 ? (_.swipeLeft = null, !1) : void _.setCSS(_.swipeLeft)) : void 0)
    }, Slick.prototype.swipeStart = function (event) {
        var touches, _ = this;
        return 1 !== _.touchObject.fingerCount || _.slideCount <= _.options.slidesToShow ? (_.touchObject = {}, !1) : (void 0 !== event.originalEvent && void 0 !== event.originalEvent.touches && (touches = event.originalEvent.touches[0]), _.touchObject.startX = _.touchObject.curX = void 0 !== touches ? touches.pageX : event.clientX, _.touchObject.startY = _.touchObject.curY = void 0 !== touches ? touches.pageY : event.clientY, void(_.dragging = !0))
    }, Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
        var _ = this;
        null !== _.$slidesCache && (_.unload(), _.$slideTrack.children(this.options.slide).detach(), _.$slidesCache.appendTo(_.$slideTrack), _.reinit())
    }, Slick.prototype.unload = function () {
        var _ = this;
        $(".slick-cloned", _.$slider).remove(), _.$dots && _.$dots.remove(), _.$prevArrow && _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.remove(), _.$nextArrow && _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.remove(), _.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, Slick.prototype.unslick = function (fromBreakpoint) {
        var _ = this;
        _.$slider.trigger("unslick", [_, fromBreakpoint]), _.destroy()
    }, Slick.prototype.updateArrows = function () {
        var centerOffset, _ = this;
        centerOffset = Math.floor(_.options.slidesToShow / 2), _.options.arrows === !0 && _.slideCount > _.options.slidesToShow && !_.options.infinite && (_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), _.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === _.currentSlide ? (_.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), _.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : _.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === !1 ? (_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), _.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : _.currentSlide >= _.slideCount - 1 && _.options.centerMode === !0 && (_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), _.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, Slick.prototype.updateDots = function () {
        var _ = this;
        null !== _.$dots && (_.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), _.$dots.find("li").eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
    }, Slick.prototype.visibility = function () {
        var _ = this;
        document[_.hidden] ? (_.paused = !0, _.autoPlayClear()) : _.options.autoplay === !0 && (_.paused = !1, _.autoPlay())
    }, Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), _.$slideTrack.attr("role", "listbox"), _.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function (i) {
            $(this).attr({
                role: "option",
                "aria-describedby": "slick-slide" + _.instanceUid + i
            })
        }), null !== _.$dots && _.$dots.attr("role", "tablist").find("li").each(function (i) {
            $(this).attr({
                role: "presentation",
                "aria-selected": "false",
                "aria-controls": "navigation" + _.instanceUid + i,
                id: "slick-slide" + _.instanceUid + i
            })
        }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), _.activateADA()
    }, Slick.prototype.activateADA = function () {
        var _ = this,
            _isSlideOnFocus = _.$slider.find("*").is(":focus");
        _.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false",
            tabindex: "0"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        }), _isSlideOnFocus && _.$slideTrack.find(".slick-active").focus()
    }, Slick.prototype.focusHandler = function () {
        var _ = this;
        _.$slider.on("focus.slick blur.slick", "*", function (event) {
            event.stopImmediatePropagation();
            var sf = $(this);
            setTimeout(function () {
                _.isPlay && (sf.is(":focus") ? (_.autoPlayClear(), _.paused = !0) : (_.paused = !1, _.autoPlay()))
            }, 0)
        })
    }, $.fn.slick = function () {
        var ret, _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i = 0;
        for (i; l > i; i++)
            if ("object" == typeof opt || "undefined" == typeof opt ? _[i].slick = new Slick(_[i], opt) : ret = _[i].slick[opt].apply(_[i].slick, args), "undefined" != typeof ret) return ret;
        return _
    }
}),
function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function ($) {
    if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) return $;
    var n = /^(https?:)?\/\//i,
        o = /^get|post$/i,
        p = new RegExp("^(//|" + location.protocol + ")", "i");
    return $.ajaxTransport("* text html xml json", function (j, k, l) {
        if (j.crossDomain && j.async && o.test(j.type) && n.test(j.url) && p.test(j.url)) {
            var m = null;
            return {
                send: function (f, g) {
                    var h = "",
                        i = (k.dataType || "").toLowerCase();
                    m = new XDomainRequest, /^\d+$/.test(k.timeout) && (m.timeout = k.timeout), m.ontimeout = function () {
                        g(500, "timeout")
                    }, m.onload = function () {
                        var a = "Content-Length: " + m.responseText.length + "\r\nContent-Type: " + m.contentType,
                            b = {
                                code: 200,
                                message: "success"
                            },
                            c = {
                                text: m.responseText
                            };
                        try {
                            if ("html" === i || /text\/html/i.test(m.contentType)) c.html = m.responseText;
                            else if ("json" === i || "text" !== i && /\/json/i.test(m.contentType)) try {
                                c.json = $.parseJSON(m.responseText)
                            } catch (e) {
                                b.code = 500, b.message = "parseerror"
                            } else if ("xml" === i || "text" !== i && /\/xml/i.test(m.contentType)) {
                                var d = new ActiveXObject("Microsoft.XMLDOM");
                                d.async = !1;
                                try {
                                    d.loadXML(m.responseText)
                                } catch (e) {
                                    d = void 0
                                }
                                if (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) throw b.code = 500, b.message = "parseerror", "Invalid XML: " + m.responseText;
                                c.xml = d
                            }
                        } catch (parseMessage) {
                            throw parseMessage
                        } finally {
                            g(b.code, b.message, c, a)
                        }
                    }, m.onprogress = function () {}, m.onerror = function () {
                        g(500, "error", {
                            text: m.responseText
                        })
                    }, k.data && (h = "string" === $.type(k.data) ? k.data : $.param(k.data)), m.open(j.type, j.url), m.send(h)
                },
                abort: function () {
                    m && m.abort()
                }
            }
        }
    }), $
}),
function (window) {
    "use strict";
    window.ParsleyConfig = window.ParsleyConfig || {}, window.ParsleyConfig = $.extend(window.ParsleyConfig || {}, {
        errorClass: "has-error",
        successClass: "has-success",
        errorsWrapper: '<div class="help-block parsley-errors-list"></div>',
        errorTemplate: '<div class="parsley-error-item"></div>',
        classHandler: function (ParsleyField) {
            return ParsleyField.$element.closest(".form-group")
        }
    })
}(window), ! function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function (a) {
    function b(a, b) {
        return a.parsleyAdaptedCallback || (a.parsleyAdaptedCallback = function () {
            var c = Array.prototype.slice.call(arguments, 0);
            c.unshift(this), a.apply(b || q, c)
        }), a.parsleyAdaptedCallback
    }

    function c(a) {
        return 0 === a.lastIndexOf(s, 0) ? a.substr(s.length) : a
    }
    "undefined" == typeof a && "undefined" != typeof window.jQuery && (a = window.jQuery);
    var d = 1,
        e = {},
        f = {
            attr: function (a, b, c) {
                var d, e, f = new RegExp("^" + b, "i");
                if ("undefined" == typeof c) c = {};
                else
                    for (var g in c) c.hasOwnProperty(g) && delete c[g];
                if ("undefined" == typeof a || "undefined" == typeof a[0]) return c;
                e = a[0].attributes;
                for (var g = e.length; g--;) d = e[g], d && d.specified && f.test(d.name) && (c[this.camelize(d.name.slice(b.length))] = this.deserializeValue(d.value));
                return c
            },
            checkAttr: function (a, b, c) {
                return a.is("[" + b + c + "]")
            },
            setAttr: function (a, b, c, d) {
                a[0].setAttribute(this.dasherize(b + c), String(d))
            },
            generateID: function () {
                return "" + d++
            },
            deserializeValue: function (b) {
                var c;
                try {
                    return b ? "true" == b || ("false" == b ? !1 : "null" == b ? null : isNaN(c = Number(b)) ? /^[\[\{]/.test(b) ? a.parseJSON(b) : b : c) : b
                } catch (d) {
                    return b
                }
            },
            camelize: function (a) {
                return a.replace(/-+(.)?/g, function (a, b) {
                    return b ? b.toUpperCase() : ""
                })
            },
            dasherize: function (a) {
                return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
            },
            warn: function () {
                window.console && "function" == typeof window.console.warn && window.console.warn.apply(window.console, arguments)
            },
            warnOnce: function (a) {
                e[a] || (e[a] = !0, this.warn.apply(this, arguments))
            },
            _resetWarnings: function () {
                e = {}
            },
            objectCreate: Object.create || function () {
                var a = function () {};
                return function (b) {
                    if (arguments.length > 1) throw Error("Second argument not supported");
                    if ("object" != typeof b) throw TypeError("Argument must be an object");
                    a.prototype = b;
                    var c = new a;
                    return a.prototype = null, c
                }
            }()
        },
        g = {
            namespace: "data-parsley-",
            inputs: "input, textarea, select",
            excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden]",
            priorityEnabled: !0,
            multiple: null,
            group: null,
            uiEnabled: !0,
            validationThreshold: 3,
            focus: "first",
            trigger: !1,
            errorClass: "parsley-error",
            successClass: "parsley-success",
            classHandler: function () {},
            errorsContainer: function () {},
            errorsWrapper: '<ul class="parsley-errors-list"></ul>',
            errorTemplate: "<li></li>"
        },
        h = function () {};
    h.prototype = {
        asyncSupport: !1,
        actualizeOptions: function () {
            return f.attr(this.$element, this.options.namespace, this.domOptions), this.parent && this.parent.actualizeOptions && this.parent.actualizeOptions(), this
        },
        _resetOptions: function (a) {
            this.domOptions = f.objectCreate(this.parent.options), this.options = f.objectCreate(this.domOptions);
            for (var b in a) a.hasOwnProperty(b) && (this.options[b] = a[b]);
            this.actualizeOptions()
        },
        validateThroughValidator: function (a, b, c) {
            return window.ParsleyValidator.validate(a, b, c)
        },
        _listeners: null,
        on: function (a, b) {
            this._listeners = this._listeners || {};
            var c = this._listeners[a] = this._listeners[a] || [];
            return c.push(b), this
        },
        subscribe: function (b, c) {
            a.listenTo(this, b.toLowerCase(), c)
        },
        off: function (a, b) {
            var c = this._listeners && this._listeners[a];
            if (c)
                if (b)
                    for (var d = c.length; d--;) c[d] === b && c.splice(d, 1);
                else delete this._listeners[a];
            return this
        },
        unsubscribe: function (b) {
            a.unsubscribeTo(this, b.toLowerCase())
        },
        trigger: function (a, b) {
            b = b || this;
            var c, d = this._listeners && this._listeners[a];
            if (d)
                for (var e = d.length; e--;)
                    if (c = d[e].call(b, b), c === !1) return c;
            return this.parent ? this.parent.trigger(a, b) : !0
        },
        reset: function () {
            if ("ParsleyForm" !== this.__class__) return this._trigger("reset");
            for (var a = 0; a < this.fields.length; a++) this.fields[a]._trigger("reset");
            this._trigger("reset")
        },
        destroy: function () {
            if ("ParsleyForm" !== this.__class__) return this.$element.removeData("Parsley"), this.$element.removeData("ParsleyFieldMultiple"), void this._trigger("destroy");
            for (var a = 0; a < this.fields.length; a++) this.fields[a].destroy();
            this.$element.removeData("Parsley"), this._trigger("destroy")
        },
        _findRelatedMultiple: function () {
            return this.parent.$element.find("[" + this.options.namespace + 'multiple="' + this.options.multiple + '"]')
        }
    };
    var i = function () {
        var a = {},
            b = function (a) {
                this.__class__ = "Validator", this.__version__ = "1.0.1", this.options = a || {}, this.bindingKey = this.options.bindingKey || "_validatorjsConstraint"
            };
        b.prototype = {
            constructor: b,
            validate: function (a, b, c) {
                if ("string" != typeof a && "object" != typeof a) throw new Error("You must validate an object or a string");
                return "string" == typeof a || g(a) ? this._validateString(a, b, c) : this.isBinded(a) ? this._validateBindedObject(a, b) : this._validateObject(a, b, c)
            },
            bind: function (a, b) {
                if ("object" != typeof a) throw new Error("Must bind a Constraint to an object");
                return a[this.bindingKey] = new c(b), this
            },
            unbind: function (a) {
                return "undefined" == typeof a._validatorjsConstraint ? this : (delete a[this.bindingKey], this)
            },
            isBinded: function (a) {
                return "undefined" != typeof a[this.bindingKey]
            },
            getBinded: function (a) {
                return this.isBinded(a) ? a[this.bindingKey] : null
            },
            _validateString: function (a, b, c) {
                var f, h = [];
                g(b) || (b = [b]);
                for (var i = 0; i < b.length; i++) {
                    if (!(b[i] instanceof e)) throw new Error("You must give an Assert or an Asserts array to validate a string");
                    f = b[i].check(a, c), f instanceof d && h.push(f)
                }
                return h.length ? h : !0
            },
            _validateObject: function (a, b, d) {
                if ("object" != typeof b) throw new Error("You must give a constraint to validate an object");
                return b instanceof c ? b.check(a, d) : new c(b).check(a, d)
            },
            _validateBindedObject: function (a, b) {
                return a[this.bindingKey].check(a, b)
            }
        }, b.errorCode = {
            must_be_a_string: "must_be_a_string",
            must_be_an_array: "must_be_an_array",
            must_be_a_number: "must_be_a_number",
            must_be_a_string_or_array: "must_be_a_string_or_array"
        };
        var c = function (a, b) {
            if (this.__class__ = "Constraint", this.options = b || {}, this.nodes = {}, a) try {
                this._bootstrap(a)
            } catch (c) {
                throw new Error("Should give a valid mapping object to Constraint", c, a)
            }
        };
        c.prototype = {
            constructor: c,
            check: function (a, b) {
                var c, d = {};
                for (var h in this.nodes) {
                    for (var i = !1, j = this.get(h), k = g(j) ? j : [j], l = k.length - 1; l >= 0; l--) "Required" !== k[l].__class__ || (i = k[l].requiresValidation(b));
                    if (this.has(h, a) || this.options.strict || i) try {
                        this.has(h, this.options.strict || i ? a : void 0) || (new e).HaveProperty(h).validate(a), c = this._check(h, a[h], b), (g(c) && c.length > 0 || !g(c) && !f(c)) && (d[h] = c)
                    } catch (m) {
                        d[h] = m
                    }
                }
                return f(d) ? !0 : d
            },
            add: function (a, b) {
                if (b instanceof e || g(b) && b[0] instanceof e) return this.nodes[a] = b, this;
                if ("object" == typeof b && !g(b)) return this.nodes[a] = b instanceof c ? b : new c(b), this;
                throw new Error("Should give an Assert, an Asserts array, a Constraint", b)
            },
            has: function (a, b) {
                return b = "undefined" != typeof b ? b : this.nodes, "undefined" != typeof b[a]
            },
            get: function (a, b) {
                return this.has(a) ? this.nodes[a] : b || null
            },
            remove: function (a) {
                var b = [];
                for (var c in this.nodes) c !== a && (b[c] = this.nodes[c]);
                return this.nodes = b, this
            },
            _bootstrap: function (a) {
                if (a instanceof c) return this.nodes = a.nodes;
                for (var b in a) this.add(b, a[b])
            },
            _check: function (a, b, d) {
                if (this.nodes[a] instanceof e) return this._checkAsserts(b, [this.nodes[a]], d);
                if (g(this.nodes[a])) return this._checkAsserts(b, this.nodes[a], d);
                if (this.nodes[a] instanceof c) return this.nodes[a].check(b, d);
                throw new Error("Invalid node", this.nodes[a])
            },
            _checkAsserts: function (a, b, c) {
                for (var d, e = [], f = 0; f < b.length; f++) d = b[f].check(a, c), "undefined" != typeof d && !0 !== d && e.push(d);
                return e
            }
        };
        var d = function (a, b, c) {
            if (this.__class__ = "Violation", !(a instanceof e)) throw new Error("Should give an assertion implementing the Assert interface");
            this.assert = a, this.value = b, "undefined" != typeof c && (this.violation = c)
        };
        d.prototype = {
            show: function () {
                var a = {
                    assert: this.assert.__class__,
                    value: this.value
                };
                return this.violation && (a.violation = this.violation), a
            },
            __toString: function () {
                return "undefined" != typeof this.violation && (this.violation = '", ' + this.getViolation().constraint + " expected was " + this.getViolation().expected), this.assert.__class__ + ' assert failed for "' + this.value + this.violation || ""
            },
            getViolation: function () {
                var a, b;
                for (a in this.violation) b = this.violation[a];
                return {
                    constraint: a,
                    expected: b
                }
            }
        };
        var e = function (a) {
            this.__class__ = "Assert", this.__parentClass__ = this.__class__, this.groups = [], "undefined" != typeof a && this.addGroup(a)
        };
        e.prototype = {
            construct: e,
            requiresValidation: function (a) {
                return a && !this.hasGroup(a) ? !1 : !a && this.hasGroups() ? !1 : !0
            },
            check: function (a, b) {
                if (this.requiresValidation(b)) try {
                    return this.validate(a, b)
                } catch (c) {
                    return c
                }
            },
            hasGroup: function (a) {
                return g(a) ? this.hasOneOf(a) : "Any" === a ? !0 : this.hasGroups() ? -1 !== this.groups.indexOf(a) : "Default" === a
            },
            hasOneOf: function (a) {
                for (var b = 0; b < a.length; b++)
                    if (this.hasGroup(a[b])) return !0;
                return !1
            },
            hasGroups: function () {
                return this.groups.length > 0
            },
            addGroup: function (a) {
                return g(a) ? this.addGroups(a) : (this.hasGroup(a) || this.groups.push(a), this)
            },
            removeGroup: function (a) {
                for (var b = [], c = 0; c < this.groups.length; c++) a !== this.groups[c] && b.push(this.groups[c]);
                return this.groups = b, this
            },
            addGroups: function (a) {
                for (var b = 0; b < a.length; b++) this.addGroup(a[b]);
                return this
            },
            HaveProperty: function (a) {
                return this.__class__ = "HaveProperty", this.node = a, this.validate = function (a) {
                    if ("undefined" == typeof a[this.node]) throw new d(this, a, {
                        value: this.node
                    });
                    return !0
                }, this
            },
            Blank: function () {
                return this.__class__ = "Blank", this.validate = function (a) {
                    if ("string" != typeof a) throw new d(this, a, {
                        value: b.errorCode.must_be_a_string
                    });
                    if ("" !== a.replace(/^\s+/g, "").replace(/\s+$/g, "")) throw new d(this, a);
                    return !0
                }, this
            },
            Callback: function (a) {
                if (this.__class__ = "Callback", this.arguments = Array.prototype.slice.call(arguments), 1 === this.arguments.length ? this.arguments = [] : this.arguments.splice(0, 1), "function" != typeof a) throw new Error("Callback must be instanciated with a function");
                return this.fn = a, this.validate = function (a) {
                    var b = this.fn.apply(this, [a].concat(this.arguments));
                    if (!0 !== b) throw new d(this, a, {
                        result: b
                    });
                    return !0
                }, this
            },
            Choice: function (a) {
                if (this.__class__ = "Choice", !g(a) && "function" != typeof a) throw new Error("Choice must be instanciated with an array or a function");
                return this.list = a, this.validate = function (a) {
                    for (var b = "function" == typeof this.list ? this.list() : this.list, c = 0; c < b.length; c++)
                        if (a === b[c]) return !0;
                    throw new d(this, a, {
                        choices: b
                    })
                }, this
            },
            Collection: function (a) {
                return this.__class__ = "Collection", this.constraint = "undefined" != typeof a ? a instanceof e ? a : new c(a) : !1, this.validate = function (a, c) {
                    var e, h = new b,
                        i = 0,
                        j = {},
                        k = this.groups.length ? this.groups : c;
                    if (!g(a)) throw new d(this, a, {
                        value: b.errorCode.must_be_an_array
                    });
                    for (var l = 0; l < a.length; l++) e = this.constraint ? h.validate(a[l], this.constraint, k) : h.validate(a[l], k), f(e) || (j[i] = e), i++;
                    return f(j) ? !0 : j
                }, this
            },
            Count: function (a) {
                return this.__class__ = "Count", this.count = a, this.validate = function (a) {
                    if (!g(a)) throw new d(this, a, {
                        value: b.errorCode.must_be_an_array
                    });
                    var c = "function" == typeof this.count ? this.count(a) : this.count;
                    if (isNaN(Number(c))) throw new Error("Count must be a valid interger", c);
                    if (c !== a.length) throw new d(this, a, {
                        count: c
                    });
                    return !0
                }, this
            },
            Email: function () {
                return this.__class__ = "Email", this.validate = function (a) {
                    var c = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                    if ("string" != typeof a) throw new d(this, a, {
                        value: b.errorCode.must_be_a_string
                    });
                    if (!c.test(a)) throw new d(this, a);
                    return !0
                }, this
            },
            EqualTo: function (a) {
                if (this.__class__ = "EqualTo", "undefined" == typeof a) throw new Error("EqualTo must be instanciated with a value or a function");
                return this.reference = a, this.validate = function (a) {
                    var b = "function" == typeof this.reference ? this.reference(a) : this.reference;
                    if (b !== a) throw new d(this, a, {
                        value: b
                    });
                    return !0
                }, this
            },
            GreaterThan: function (a) {
                if (this.__class__ = "GreaterThan", "undefined" == typeof a) throw new Error("Should give a threshold value");
                return this.threshold = a, this.validate = function (a) {
                    if ("" === a || isNaN(Number(a))) throw new d(this, a, {
                        value: b.errorCode.must_be_a_number
                    });
                    if (this.threshold >= a) throw new d(this, a, {
                        threshold: this.threshold
                    });
                    return !0
                }, this
            },
            GreaterThanOrEqual: function (a) {
                if (this.__class__ = "GreaterThanOrEqual", "undefined" == typeof a) throw new Error("Should give a threshold value");
                return this.threshold = a, this.validate = function (a) {
                    if ("" === a || isNaN(Number(a))) throw new d(this, a, {
                        value: b.errorCode.must_be_a_number
                    });
                    if (this.threshold > a) throw new d(this, a, {
                        threshold: this.threshold
                    });
                    return !0
                }, this
            },
            InstanceOf: function (a) {
                if (this.__class__ = "InstanceOf", "undefined" == typeof a) throw new Error("InstanceOf must be instanciated with a value");
                return this.classRef = a, this.validate = function (a) {
                    if (1 != a instanceof this.classRef) throw new d(this, a, {
                        classRef: this.classRef
                    });
                    return !0
                }, this
            },
            Length: function (a) {
                if (this.__class__ = "Length", !a.min && !a.max) throw new Error("Lenth assert must be instanciated with a { min: x, max: y } object");
                return this.min = a.min, this.max = a.max, this.validate = function (a) {
                    if ("string" != typeof a && !g(a)) throw new d(this, a, {
                        value: b.errorCode.must_be_a_string_or_array
                    });
                    if ("undefined" != typeof this.min && this.min === this.max && a.length !== this.min) throw new d(this, a, {
                        min: this.min,
                        max: this.max
                    });
                    if ("undefined" != typeof this.max && a.length > this.max) throw new d(this, a, {
                        max: this.max
                    });
                    if ("undefined" != typeof this.min && a.length < this.min) throw new d(this, a, {
                        min: this.min
                    });
                    return !0
                }, this
            },
            LessThan: function (a) {
                if (this.__class__ = "LessThan", "undefined" == typeof a) throw new Error("Should give a threshold value");
                return this.threshold = a, this.validate = function (a) {
                    if ("" === a || isNaN(Number(a))) throw new d(this, a, {
                        value: b.errorCode.must_be_a_number
                    });
                    if (this.threshold <= a) throw new d(this, a, {
                        threshold: this.threshold
                    });
                    return !0
                }, this
            },
            LessThanOrEqual: function (a) {
                if (this.__class__ = "LessThanOrEqual", "undefined" == typeof a) throw new Error("Should give a threshold value");
                return this.threshold = a, this.validate = function (a) {
                    if ("" === a || isNaN(Number(a))) throw new d(this, a, {
                        value: b.errorCode.must_be_a_number
                    });
                    if (this.threshold < a) throw new d(this, a, {
                        threshold: this.threshold
                    });
                    return !0
                }, this
            },
            NotNull: function () {
                return this.__class__ = "NotNull", this.validate = function (a) {
                    if (null === a || "undefined" == typeof a) throw new d(this, a);
                    return !0
                }, this
            },
            NotBlank: function () {
                return this.__class__ = "NotBlank", this.validate = function (a) {
                    if ("string" != typeof a) throw new d(this, a, {
                        value: b.errorCode.must_be_a_string
                    });
                    if ("" === a.replace(/^\s+/g, "").replace(/\s+$/g, "")) throw new d(this, a);
                    return !0
                }, this
            },
            Null: function () {
                return this.__class__ = "Null", this.validate = function (a) {
                    if (null !== a) throw new d(this, a);
                    return !0
                }, this
            },
            Range: function (a, b) {
                if (this.__class__ = "Range", "undefined" == typeof a || "undefined" == typeof b) throw new Error("Range assert expects min and max values");
                return this.min = a, this.max = b, this.validate = function (a) {
                    try {
                        return "string" == typeof a && isNaN(Number(a)) || g(a) ? (new e).Length({
                            min: this.min,
                            max: this.max
                        }).validate(a) : (new e).GreaterThanOrEqual(this.min).validate(a) && (new e).LessThanOrEqual(this.max).validate(a), !0
                    } catch (b) {
                        throw new d(this, a, b.violation)
                    }
                    return !0
                }, this
            },
            Regexp: function (a, c) {
                if (this.__class__ = "Regexp", "undefined" == typeof a) throw new Error("You must give a regexp");
                return this.regexp = a, this.flag = c || "", this.validate = function (a) {
                    if ("string" != typeof a) throw new d(this, a, {
                        value: b.errorCode.must_be_a_string
                    });
                    if (!new RegExp(this.regexp, this.flag).test(a)) throw new d(this, a, {
                        regexp: this.regexp,
                        flag: this.flag
                    });
                    return !0
                }, this
            },
            Required: function () {
                return this.__class__ = "Required", this.validate = function (a) {
                    if ("undefined" == typeof a) throw new d(this, a);
                    try {
                        "string" == typeof a ? (new e).NotNull().validate(a) && (new e).NotBlank().validate(a) : !0 === g(a) && (new e).Length({
                            min: 1
                        }).validate(a)
                    } catch (b) {
                        throw new d(this, a)
                    }
                    return !0
                }, this
            },
            Unique: function (a) {
                return this.__class__ = "Unique", "object" == typeof a && (this.key = a.key), this.validate = function (a) {
                    var c, e = [];
                    if (!g(a)) throw new d(this, a, {
                        value: b.errorCode.must_be_an_array
                    });
                    for (var f = 0; f < a.length; f++)
                        if (c = "object" == typeof a[f] ? a[f][this.key] : a[f], "undefined" != typeof c) {
                            if (-1 !== e.indexOf(c)) throw new d(this, a, {
                                value: c
                            });
                            e.push(c)
                        }
                    return !0
                }, this
            }
        }, a.Assert = e, a.Validator = b, a.Violation = d, a.Constraint = c, Array.prototype.indexOf || (Array.prototype.indexOf = function (a) {
            "use strict";
            if (null === this) throw new TypeError;
            var b = Object(this),
                c = b.length >>> 0;
            if (0 === c) return -1;
            var d = 0;
            if (arguments.length > 1 && (d = Number(arguments[1]), d != d ? d = 0 : 0 !== d && d != 1 / 0 && d != -(1 / 0) && (d = (d > 0 || -1) * Math.floor(Math.abs(d)))), d >= c) return -1;
            for (var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0); c > e; e++)
                if (e in b && b[e] === a) return e;
            return -1
        });
        var f = function (a) {
                for (var b in a) return !1;
                return !0
            },
            g = function (a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            };
        return "function" == typeof define && define.amd ? define("vendors/validator.js/dist/validator", [], function () {
            return a
        }) : "undefined" != typeof module && module.exports ? module.exports = a : window["undefined" != typeof validatorjs_ns ? validatorjs_ns : "Validator"] = a, a
    }();
    i = "undefined" != typeof i ? i : "undefined" != typeof module ? module.exports : null;
    var j = function (a, b) {
        this.__class__ = "ParsleyValidator", this.Validator = i, this.locale = "en", this.init(a || {}, b || {})
    };
    j.prototype = {
        init: function (b, c) {
            this.catalog = c, this.validators = a.extend({}, this.validators);
            for (var d in b) this.addValidator(d, b[d].fn, b[d].priority, b[d].requirementsTransformer);
            window.Parsley.trigger("parsley:validator:init")
        },
        setLocale: function (a) {
            if ("undefined" == typeof this.catalog[a]) throw new Error(a + " is not available in the catalog");
            return this.locale = a, this
        },
        addCatalog: function (a, b, c) {
            return "object" == typeof b && (this.catalog[a] = b), !0 === c ? this.setLocale(a) : this
        },
        addMessage: function (a, b, c) {
            return "undefined" == typeof this.catalog[a] && (this.catalog[a] = {}), this.catalog[a][b.toLowerCase()] = c, this
        },
        validate: function () {
            return (new this.Validator.Validator).validate.apply(new i.Validator, arguments)
        },
        addValidator: function (a, b, c, d) {
            if (this.validators[a]) f.warn('Validator "' + a + '" is already defined.');
            else if (g.hasOwnProperty(a)) return void f.warn('"' + a + '" is a restricted keyword and is not a valid validator name.');
            return this._setValidator(a, b, c, d)
        },
        updateValidator: function (a, b, c, d) {
            return this.validators[a] ? this._setValidator(a, b, c, d) : (f.warn('Validator "' + a + '" is not already defined.'), this.addValidator(a, b, c, d))
        },
        removeValidator: function (a) {
            return this.validators[a] || f.warn('Validator "' + a + '" is not defined.'), delete this.validators[a], this
        },
        _setValidator: function (b, c, d, e) {
            return this.validators[b] = function (b) {
                return a.extend((new i.Assert).Callback(c, b), {
                    priority: d,
                    requirementsTransformer: e
                })
            }, this
        },
        getErrorMessage: function (a) {
            var b;
            if ("type" === a.name) {
                var c = this.catalog[this.locale][a.name] || {};
                b = c[a.requirements]
            } else b = this.formatMessage(this.catalog[this.locale][a.name], a.requirements);
            return b || this.catalog[this.locale].defaultMessage || this.catalog.en.defaultMessage
        },
        formatMessage: function (a, b) {
            if ("object" == typeof b) {
                for (var c in b) a = this.formatMessage(a, b[c]);
                return a
            }
            return "string" == typeof a ? a.replace(new RegExp("%s", "i"), b) : ""
        },
        validators: {
            notblank: function () {
                return a.extend((new i.Assert).NotBlank(), {
                    priority: 2
                })
            },
            required: function () {
                return a.extend((new i.Assert).Required(), {
                    priority: 512
                })
            },
            type: function (b) {
                var c;
                switch (b) {
                case "email":
                    c = (new i.Assert).Email();
                    break;
                case "range":
                case "number":
                    c = (new i.Assert).Regexp("^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$");
                    break;
                case "integer":
                    c = (new i.Assert).Regexp("^-?\\d+$");
                    break;
                case "digits":
                    c = (new i.Assert).Regexp("^\\d+$");
                    break;
                case "alphanum":
                    c = (new i.Assert).Regexp("^\\w+$", "i");
                    break;
                case "url":
                    c = (new i.Assert).Regexp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$", "i");
                    break;
                default:
                    throw new Error("validator type `" + b + "` is not supported")
                }
                return a.extend(c, {
                    priority: 256
                })
            },
            pattern: function (b) {
                var c = "";
                return /^\/.*\/(?:[gimy]*)$/.test(b) && (c = b.replace(/.*\/([gimy]*)$/, "$1"), b = b.replace(new RegExp("^/(.*?)/" + c + "$"), "$1")), a.extend((new i.Assert).Regexp(b, c), {
                    priority: 64
                })
            },
            minlength: function (b) {
                return a.extend((new i.Assert).Length({
                    min: b
                }), {
                    priority: 30,
                    requirementsTransformer: function () {
                        return "string" != typeof b || isNaN(b) ? b : parseInt(b, 10)
                    }
                })
            },
            maxlength: function (b) {
                return a.extend((new i.Assert).Length({
                    max: b
                }), {
                    priority: 30,
                    requirementsTransformer: function () {
                        return "string" != typeof b || isNaN(b) ? b : parseInt(b, 10)
                    }
                })
            },
            length: function (b) {
                return a.extend((new i.Assert).Length({
                    min: b[0],
                    max: b[1]
                }), {
                    priority: 32
                })
            },
            mincheck: function (a) {
                return this.minlength(a)
            },
            maxcheck: function (a) {
                return this.maxlength(a)
            },
            check: function (a) {
                return this.length(a)
            },
            min: function (b) {
                return a.extend((new i.Assert).GreaterThanOrEqual(b), {
                    priority: 30,
                    requirementsTransformer: function () {
                        return "string" != typeof b || isNaN(b) ? b : parseInt(b, 10)
                    }
                })
            },
            max: function (b) {
                return a.extend((new i.Assert).LessThanOrEqual(b), {
                    priority: 30,
                    requirementsTransformer: function () {
                        return "string" != typeof b || isNaN(b) ? b : parseInt(b, 10)
                    }
                })
            },
            range: function (b) {
                return a.extend((new i.Assert).Range(b[0], b[1]), {
                    priority: 32,
                    requirementsTransformer: function () {
                        for (var a = 0; a < b.length; a++) b[a] = "string" != typeof b[a] || isNaN(b[a]) ? b[a] : parseInt(b[a], 10);
                        return b
                    }
                })
            },
            equalto: function (b) {
                return a.extend((new i.Assert).EqualTo(b), {
                    priority: 256,
                    requirementsTransformer: function () {
                        return a(b).length ? a(b).val() : b
                    }
                })
            }
        }
    };
    var k = function () {
        this.__class__ = "ParsleyUI"
    };
    k.prototype = {
        listen: function () {
            var a = this;
            return window.Parsley.on("form:init", function () {
                a.setupForm(this)
            }).on("field:init", function () {
                a.setupField(this)
            }).on("field:validated", function () {
                a.reflow(this)
            }).on("form:validated", function () {
                a.focus(this)
            }).on("field:reset", function () {
                a.reset(this)
            }).on("form:destroy", function () {
                a.destroy(this)
            }).on("field:destroy", function () {
                a.destroy(this)
            }), this
        },
        reflow: function (a) {
            if ("undefined" != typeof a._ui && !1 !== a._ui.active) {
                var b = this._diff(a.validationResult, a._ui.lastValidationResult);
                a._ui.lastValidationResult = a.validationResult, a._ui.validatedOnce = !0, this.manageStatusClass(a), this.manageErrorsMessages(a, b), this.actualizeTriggers(a), (b.kept.length || b.added.length) && !0 !== a._ui.failedOnce && this.manageFailingFieldTrigger(a)
            }
        },
        getErrorsMessages: function (a) {
            if (!0 === a.validationResult) return [];
            for (var b = [], c = 0; c < a.validationResult.length; c++) b.push(this._getErrorMessage(a, a.validationResult[c].assert));
            return b
        },
        manageStatusClass: function (a) {
            a.hasConstraints() && a.needsValidation() && !0 === a.validationResult ? this._successClass(a) : a.validationResult.length > 0 ? this._errorClass(a) : this._resetClass(a)
        },
        manageErrorsMessages: function (b, c) {
            if ("undefined" == typeof b.options.errorsMessagesDisabled) {
                if ("undefined" != typeof b.options.errorMessage) return c.added.length || c.kept.length ? (this._insertErrorWrapper(b), 0 === b._ui.$errorsWrapper.find(".parsley-custom-error-message").length && b._ui.$errorsWrapper.append(a(b.options.errorTemplate).addClass("parsley-custom-error-message")), b._ui.$errorsWrapper.addClass("filled").find(".parsley-custom-error-message").html(b.options.errorMessage)) : b._ui.$errorsWrapper.removeClass("filled").find(".parsley-custom-error-message").remove();
                for (var d = 0; d < c.removed.length; d++) this.removeError(b, c.removed[d].assert.name, !0);
                for (d = 0; d < c.added.length; d++) this.addError(b, c.added[d].assert.name, void 0, c.added[d].assert, !0);
                for (d = 0; d < c.kept.length; d++) this.updateError(b, c.kept[d].assert.name, void 0, c.kept[d].assert, !0)
            }
        },
        addError: function (b, c, d, e, f) {
            this._insertErrorWrapper(b), b._ui.$errorsWrapper.addClass("filled").append(a(b.options.errorTemplate).addClass("parsley-" + c).html(d || this._getErrorMessage(b, e))), !0 !== f && this._errorClass(b)
        },
        updateError: function (a, b, c, d, e) {
            a._ui.$errorsWrapper.addClass("filled").find(".parsley-" + b).html(c || this._getErrorMessage(a, d)), !0 !== e && this._errorClass(a)
        },
        removeError: function (a, b, c) {
            a._ui.$errorsWrapper.removeClass("filled").find(".parsley-" + b).remove(), !0 !== c && this.manageStatusClass(a)
        },
        focus: function (a) {
            if (a._focusedField = null, !0 === a.validationResult || "none" === a.options.focus) return null;
            for (var b = 0; b < a.fields.length; b++) {
                var c = a.fields[b];
                if (!0 !== c.validationResult && c.validationResult.length > 0 && "undefined" == typeof c.options.noFocus && (a._focusedField = c.$element, "first" === a.options.focus)) break
            }
            return null === a._focusedField ? null : a._focusedField.focus()
        },
        _getErrorMessage: function (a, b) {
            var c = b.name + "Message";
            return "undefined" != typeof a.options[c] ? window.ParsleyValidator.formatMessage(a.options[c], b.requirements) : window.ParsleyValidator.getErrorMessage(b)
        },
        _diff: function (a, b, c) {
            for (var d = [], e = [], f = 0; f < a.length; f++) {
                for (var g = !1, h = 0; h < b.length; h++)
                    if (a[f].assert.name === b[h].assert.name) {
                        g = !0;
                        break
                    }
                g ? e.push(a[f]) : d.push(a[f])
            }
            return {
                kept: e,
                added: d,
                removed: c ? [] : this._diff(b, a, !0).added
            }
        },
        setupForm: function (b) {
            b.$element.on("submit.Parsley", !1, a.proxy(b.onSubmitValidate, b)), !1 !== b.options.uiEnabled && b.$element.attr("novalidate", "")
        },
        setupField: function (b) {
            var c = {
                active: !1
            };
            !1 !== b.options.uiEnabled && (c.active = !0, b.$element.attr(b.options.namespace + "id", b.__id__), c.$errorClassHandler = this._manageClassHandler(b), c.errorsWrapperId = "parsley-id-" + (b.options.multiple ? "multiple-" + b.options.multiple : b.__id__), c.$errorsWrapper = a(b.options.errorsWrapper).attr("id", c.errorsWrapperId), c.lastValidationResult = [], c.validatedOnce = !1, c.validationInformationVisible = !1, b._ui = c, this.actualizeTriggers(b))
        },
        _manageClassHandler: function (b) {
            if ("string" == typeof b.options.classHandler && a(b.options.classHandler).length) return a(b.options.classHandler);
            var c = b.options.classHandler(b);
            return "undefined" != typeof c && c.length ? c : !b.options.multiple || b.$element.is("select") ? b.$element : b.$element.parent()
        },
        _insertErrorWrapper: function (b) {
            var c;
            if (0 !== b._ui.$errorsWrapper.parent().length) return b._ui.$errorsWrapper.parent();
            if ("string" == typeof b.options.errorsContainer) {
                if (a(b.options.errorsContainer).length) return a(b.options.errorsContainer).append(b._ui.$errorsWrapper);
                f.warn("The errors container `" + b.options.errorsContainer + "` does not exist in DOM")
            } else "function" == typeof b.options.errorsContainer && (c = b.options.errorsContainer(b));
            if ("undefined" != typeof c && c.length) return c.append(b._ui.$errorsWrapper);
            var d = b.$element;
            return b.options.multiple && (d = d.parent()), d.after(b._ui.$errorsWrapper)
        },
        actualizeTriggers: function (b) {
            var c = b.$element;
            if (b.options.multiple && (c = a("[" + b.options.namespace + 'multiple="' + b.options.multiple + '"]')), c.off(".Parsley"), !1 !== b.options.trigger) {
                var d = b.options.trigger.replace(/^\s+/g, "").replace(/\s+$/g, "");
                "" !== d && c.on(d.split(" ").join(".Parsley ") + ".Parsley", a.proxy("function" == typeof b.eventValidate ? b.eventValidate : this.eventValidate, b))
            }
        },
        eventValidate: function (a) {
            new RegExp("key").test(a.type) && !this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold || (this._ui.validatedOnce = !0, this.validate())
        },
        manageFailingFieldTrigger: function (b) {
            return b._ui.failedOnce = !0, b.options.multiple && a("[" + b.options.namespace + 'multiple="' + b.options.multiple + '"]').each(function () {
                return new RegExp("change", "i").test(a(this).parsley().options.trigger || "") ? void 0 : a(this).on("change.ParsleyFailedOnce", !1, a.proxy(b.validate, b))
            }), b.$element.is("select") && !new RegExp("change", "i").test(b.options.trigger || "") ? b.$element.on("change.ParsleyFailedOnce", !1, a.proxy(b.validate, b)) : new RegExp("keyup", "i").test(b.options.trigger || "") ? void 0 : b.$element.on("keyup.ParsleyFailedOnce", !1, a.proxy(b.validate, b))
        },
        reset: function (a) {
            this.actualizeTriggers(a), a.$element.off(".ParsleyFailedOnce"), "undefined" != typeof a._ui && "ParsleyForm" !== a.__class__ && (a._ui.$errorsWrapper.removeClass("filled").children().remove(), this._resetClass(a), a._ui.validatedOnce = !1, a._ui.lastValidationResult = [], a._ui.validationInformationVisible = !1, a._ui.failedOnce = !1)
        },
        destroy: function (a) {
            this.reset(a), "ParsleyForm" !== a.__class__ && ("undefined" != typeof a._ui && a._ui.$errorsWrapper.remove(), delete a._ui)
        },
        _successClass: function (a) {
            a._ui.validationInformationVisible = !0, a._ui.$errorClassHandler.removeClass(a.options.errorClass).addClass(a.options.successClass)
        },
        _errorClass: function (a) {
            a._ui.validationInformationVisible = !0, a._ui.$errorClassHandler.removeClass(a.options.successClass).addClass(a.options.errorClass)
        },
        _resetClass: function (a) {
            a._ui.$errorClassHandler.removeClass(a.options.successClass).removeClass(a.options.errorClass)
        }
    };
    var l = function (b, c, d) {
        this.__class__ = "ParsleyForm", this.__id__ = f.generateID(), this.$element = a(b), this.domOptions = c, this.options = d, this.parent = window.Parsley, this.fields = [], this.validationResult = null
    };
    l.prototype = {
        onSubmitValidate: function (b) {
            return this.validate(void 0, void 0, b), (!1 === this.validationResult || !this._trigger("submit")) && b instanceof a.Event && (b.stopImmediatePropagation(), b.preventDefault()), this
        },
        validate: function (a, b, c) {
            this.submitEvent = c, this.validationResult = !0;
            var d = [];
            return this._trigger("validate"), this._refreshFields(), this._withoutReactualizingFormOptions(function () {
                for (var c = 0; c < this.fields.length; c++)(!a || this._isFieldInGroup(this.fields[c], a)) && (d = this.fields[c].validate(b), !0 !== d && d.length > 0 && this.validationResult && (this.validationResult = !1))
            }), this._trigger(this.validationResult ? "success" : "error"), this._trigger("validated"), this.validationResult
        },
        isValid: function (a, b) {
            return this._refreshFields(), this._withoutReactualizingFormOptions(function () {
                for (var c = 0; c < this.fields.length; c++)
                    if ((!a || this._isFieldInGroup(this.fields[c], a)) && !1 === this.fields[c].isValid(b)) return !1;
                return !0
            })
        },
        _isFieldInGroup: function (b, c) {
            return a.isArray(b.options.group) ? -1 !== a.inArray(c, b.options.group) : b.options.group === c
        },
        _refreshFields: function () {
            return this.actualizeOptions()._bindFields()
        },
        _bindFields: function () {
            var b = this,
                c = this.fields;
            return this.fields = [], this.fieldsMappedById = {}, this._withoutReactualizingFormOptions(function () {
                this.$element.find(this.options.inputs).not(this.options.excluded).each(function () {
                    var a = new t.Factory(this, {}, b);
                    "ParsleyField" !== a.__class__ && "ParsleyFieldMultiple" !== a.__class__ || !0 === a.options.excluded || "undefined" == typeof b.fieldsMappedById[a.__class__ + "-" + a.__id__] && (b.fieldsMappedById[a.__class__ + "-" + a.__id__] = a, b.fields.push(a))
                }), a(c).not(b.fields).each(function () {
                    this._trigger("reset")
                })
            }), this
        },
        _withoutReactualizingFormOptions: function (a) {
            var b = this.actualizeOptions;
            this.actualizeOptions = function () {
                return this
            };
            var c = a.call(this);
            return this.actualizeOptions = b, c
        },
        _trigger: function (a) {
            return a = "form:" + a, this.trigger.apply(this, arguments)
        }
    };
    var m = function (b, c, d, e, g) {
            var h = {};
            if (!new RegExp("ParsleyField").test(b.__class__)) throw new Error("ParsleyField or ParsleyFieldMultiple instance expected");
            if ("function" == typeof window.ParsleyValidator.validators[c] && (h = window.ParsleyValidator.validators[c](d)), "Assert" !== h.__parentClass__) throw new Error("Valid validator expected");
            var i = function () {
                return "undefined" != typeof b.options[c + "Priority"] ? b.options[c + "Priority"] : h.priority || 2
            };
            return e = e || i(), "function" == typeof h.requirementsTransformer && (d = h.requirementsTransformer(), h = window.ParsleyValidator.validators[c](d)), a.extend(h, {
                name: c,
                requirements: d,
                priority: e,
                groups: [e],
                isDomConstraint: g || f.checkAttr(b.$element, b.options.namespace, c)
            })
        },
        n = function (b, c, d, e) {
            this.__class__ = "ParsleyField", this.__id__ = f.generateID(), this.$element = a(b), "undefined" != typeof e && (this.parent = e), this.options = d, this.domOptions = c, this.constraints = [], this.constraintsByName = {}, this.validationResult = [], this._bindConstraints()
        };
    n.prototype = {
        validate: function (a) {
            return this.value = this.getValue(), this._trigger("validate"), this._trigger(this.isValid(a, this.value) ? "success" : "error"), this._trigger("validated"), this.validationResult
        },
        hasConstraints: function () {
            return 0 !== this.constraints.length
        },
        needsValidation: function (a) {
            return "undefined" == typeof a && (a = this.getValue()), a.length || this._isRequired() || "undefined" != typeof this.options.validateIfEmpty ? !0 : !1
        },
        isValid: function (a, b) {
            if (this.refreshConstraints(), this.validationResult = !0, !this.hasConstraints()) return !0;
            if (("undefined" == typeof b || null === b) && (b = this.getValue()), !this.needsValidation(b) && !0 !== a) return !0;
            var c = ["Any"];
            !1 !== this.options.priorityEnabled && (c = this._getConstraintsSortedPriorities());
            for (var d = 0; d < c.length; d++)
                if (!0 !== (this.validationResult = this.validateThroughValidator(b, this.constraints, c[d]))) return !1;
            return !0
        },
        getValue: function () {
            var a;
            return a = "function" == typeof this.options.value ? this.options.value(this) : "undefined" != typeof this.options.value ? this.options.value : this.$element.val(), "undefined" == typeof a || null === a ? "" : this._handleWhitespace(a)
        },
        refreshConstraints: function () {
            return this.actualizeOptions()._bindConstraints()
        },
        addConstraint: function (a, b, c, d) {
            if ("function" == typeof window.ParsleyValidator.validators[a]) {
                var e = new m(this, a, b, c, d);
                "undefined" !== this.constraintsByName[e.name] && this.removeConstraint(e.name), this.constraints.push(e), this.constraintsByName[e.name] = e
            }
            return this
        },
        removeConstraint: function (a) {
            for (var b = 0; b < this.constraints.length; b++)
                if (a === this.constraints[b].name) {
                    this.constraints.splice(b, 1);
                    break
                }
            return delete this.constraintsByName[a], this
        },
        updateConstraint: function (a, b, c) {
            return this.removeConstraint(a).addConstraint(a, b, c)
        },
        _bindConstraints: function () {
            for (var a = [], b = {}, c = 0; c < this.constraints.length; c++) !1 === this.constraints[c].isDomConstraint && (a.push(this.constraints[c]), b[this.constraints[c].name] = this.constraints[c]);
            this.constraints = a, this.constraintsByName = b;
            for (var d in this.options) this.addConstraint(d, this.options[d]);
            return this._bindHtml5Constraints()
        },
        _bindHtml5Constraints: function () {
            (this.$element.hasClass("required") || this.$element.attr("required")) && this.addConstraint("required", !0, void 0, !0), "string" == typeof this.$element.attr("pattern") && this.addConstraint("pattern", this.$element.attr("pattern"), void 0, !0), "undefined" != typeof this.$element.attr("min") && "undefined" != typeof this.$element.attr("max") ? this.addConstraint("range", [this.$element.attr("min"), this.$element.attr("max")], void 0, !0) : "undefined" != typeof this.$element.attr("min") ? this.addConstraint("min", this.$element.attr("min"), void 0, !0) : "undefined" != typeof this.$element.attr("max") && this.addConstraint("max", this.$element.attr("max"), void 0, !0), "undefined" != typeof this.$element.attr("minlength") && "undefined" != typeof this.$element.attr("maxlength") ? this.addConstraint("length", [this.$element.attr("minlength"), this.$element.attr("maxlength")], void 0, !0) : "undefined" != typeof this.$element.attr("minlength") ? this.addConstraint("minlength", this.$element.attr("minlength"), void 0, !0) : "undefined" != typeof this.$element.attr("maxlength") && this.addConstraint("maxlength", this.$element.attr("maxlength"), void 0, !0);
            var a = this.$element.attr("type");
            return "undefined" == typeof a ? this : "number" === a ? "undefined" == typeof this.$element.attr("step") || 0 === parseFloat(this.$element.attr("step")) % 1 ? this.addConstraint("type", "integer", void 0, !0) : this.addConstraint("type", "number", void 0, !0) : /^(email|url|range)$/i.test(a) ? this.addConstraint("type", a, void 0, !0) : this
        },
        _isRequired: function () {
            return "undefined" == typeof this.constraintsByName.required ? !1 : !1 !== this.constraintsByName.required.requirements
        },
        _trigger: function (a) {
            return a = "field:" + a, this.trigger.apply(this, arguments)
        },
        _handleWhitespace: function (a) {
            return !0 === this.options.trimValue && f.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'), "squish" === this.options.whitespace && (a = a.replace(/\s{2,}/g, " ")), ("trim" === this.options.whitespace || "squish" === this.options.whitespace || !0 === this.options.trimValue) && (a = a.replace(/^\s+|\s+$/g, "")), a
        },
        _getConstraintsSortedPriorities: function () {
            for (var a = [], b = 0; b < this.constraints.length; b++) - 1 === a.indexOf(this.constraints[b].priority) && a.push(this.constraints[b].priority);
            return a.sort(function (a, b) {
                return b - a
            }), a
        }
    };
    var o = function () {
        this.__class__ = "ParsleyFieldMultiple"
    };
    o.prototype = {
        addElement: function (a) {
            return this.$elements.push(a), this
        },
        refreshConstraints: function () {
            var b;
            if (this.constraints = [], this.$element.is("select")) return this.actualizeOptions()._bindConstraints(), this;
            for (var c = 0; c < this.$elements.length; c++)
                if (a("html").has(this.$elements[c]).length) {
                    b = this.$elements[c].data("ParsleyFieldMultiple").refreshConstraints().constraints;
                    for (var d = 0; d < b.length; d++) this.addConstraint(b[d].name, b[d].requirements, b[d].priority, b[d].isDomConstraint)
                } else this.$elements.splice(c, 1);
            return this
        },
        getValue: function () {
            if ("undefined" != typeof this.options.value) return this.options.value;
            if (this.$element.is("input[type=radio]")) return this._findRelatedMultiple().filter(":checked").val() || "";
            if (this.$element.is("input[type=checkbox]")) {
                var b = [];
                return this._findRelatedMultiple().filter(":checked").each(function () {
                    b.push(a(this).val())
                }), b
            }
            return this.$element.is("select") && null === this.$element.val() ? [] : this.$element.val()
        },
        _init: function () {
            return this.$elements = [this.$element], this
        }
    };
    var p = function (b, c, d) {
        this.$element = a(b);
        var e = this.$element.data("Parsley");
        if (e) return "undefined" != typeof d && e.parent === window.Parsley && (e.parent = d, e._resetOptions(e.options)), e;
        if (!this.$element.length) throw new Error("You must bind Parsley on an existing element.");
        if ("undefined" != typeof d && "ParsleyForm" !== d.__class__) throw new Error("Parent instance must be a ParsleyForm instance");
        return this.parent = d || window.Parsley, this.init(c)
    };
    p.prototype = {
        init: function (a) {
            return this.__class__ = "Parsley", this.__version__ = "2.1.3", this.__id__ = f.generateID(), this._resetOptions(a), this.$element.is("form") || f.checkAttr(this.$element, this.options.namespace, "validate") && !this.$element.is(this.options.inputs) ? this.bind("parsleyForm") : this.isMultiple() ? this.handleMultiple() : this.bind("parsleyField")
        },
        isMultiple: function () {
            return this.$element.is("input[type=radio], input[type=checkbox]") || this.$element.is("select") && "undefined" != typeof this.$element.attr("multiple")
        },
        handleMultiple: function () {
            var b, c, d = this;
            if (this.options.multiple || ("undefined" != typeof this.$element.attr("name") && this.$element.attr("name").length ? this.options.multiple = b = this.$element.attr("name") : "undefined" != typeof this.$element.attr("id") && this.$element.attr("id").length && (this.options.multiple = this.$element.attr("id"))), this.$element.is("select") && "undefined" != typeof this.$element.attr("multiple")) return this.options.multiple = this.options.multiple || this.__id__, this.bind("parsleyFieldMultiple");
            if (!this.options.multiple) return f.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.", this.$element), this;
            this.options.multiple = this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, ""), "undefined" != typeof b && a('input[name="' + b + '"]').each(function () {
                a(this).is("input[type=radio], input[type=checkbox]") && a(this).attr(d.options.namespace + "multiple", d.options.multiple)
            });
            for (var e = this._findRelatedMultiple(), g = 0; g < e.length; g++)
                if (c = a(e.get(g)).data("Parsley"), "undefined" != typeof c) {
                    this.$element.data("ParsleyFieldMultiple") || c.addElement(this.$element);
                    break
                }
            return this.bind("parsleyField", !0), c || this.bind("parsleyFieldMultiple")
        },
        bind: function (b, c) {
            var d;
            switch (b) {
            case "parsleyForm":
                d = a.extend(new l(this.$element, this.domOptions, this.options), window.ParsleyExtend)._bindFields();
                break;
            case "parsleyField":
                d = a.extend(new n(this.$element, this.domOptions, this.options, this.parent), window.ParsleyExtend);
                break;
            case "parsleyFieldMultiple":
                d = a.extend(new n(this.$element, this.domOptions, this.options, this.parent), new o, window.ParsleyExtend)._init();
                break;
            default:
                throw new Error(b + "is not a supported Parsley type")
            }
            return this.options.multiple && f.setAttr(this.$element, this.options.namespace, "multiple", this.options.multiple), "undefined" != typeof c ? (this.$element.data("ParsleyFieldMultiple", d), d) : (this.$element.data("Parsley", d), d._trigger("init"), d)
        }
    };
    var q = a({}),
        r = function () {
            f.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")
        },
        s = "parsley:";
    a.listen = function (a, d) {
        var e;
        if (r(), "object" == typeof arguments[1] && "function" == typeof arguments[2] && (e = arguments[1], d = arguments[2]), "function" != typeof arguments[1]) throw new Error("Wrong parameters");
        window.Parsley.on(c(a), b(d, e))
    }, a.listenTo = function (a, d, e) {
        if (r(), !(a instanceof n || a instanceof l)) throw new Error("Must give Parsley instance");
        if ("string" != typeof d || "function" != typeof e) throw new Error("Wrong parameters");
        a.on(c(d), b(e))
    }, a.unsubscribe = function (a, b) {
        if (r(), "string" != typeof a || "function" != typeof b) throw new Error("Wrong arguments");
        window.Parsley.off(c(a), b.parsleyAdaptedCallback)
    }, a.unsubscribeTo = function (a, b) {
        if (r(), !(a instanceof n || a instanceof l)) throw new Error("Must give Parsley instance");
        a.off(c(b))
    }, a.unsubscribeAll = function (b) {
        r(), window.Parsley.off(c(b)), a("form,input,textarea,select").each(function () {
            var d = a(this).data("Parsley");
            d && d.off(c(b))
        })
    }, a.emit = function (a, b) {
        r();
        var d = b instanceof n || b instanceof l,
            e = Array.prototype.slice.call(arguments, d ? 2 : 1);
        e.unshift(c(a)), d || (b = window.Parsley), b.trigger.apply(b, e)
    }, window.ParsleyConfig = window.ParsleyConfig || {}, window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {}, window.ParsleyConfig.i18n.en = jQuery.extend(window.ParsleyConfig.i18n.en || {}, {
        defaultMessage: "This value seems to be invalid.",
        type: {
            email: "This value should be a valid email.",
            url: "This value should be a valid url.",
            number: "This value should be a valid number.",
            integer: "This value should be a valid integer.",
            digits: "This value should be digits.",
            alphanum: "This value should be alphanumeric."
        },
        notblank: "This value should not be blank.",
        required: "This value is required.",
        pattern: "This value seems to be invalid.",
        min: "This value should be greater than or equal to %s.",
        max: "This value should be lower than or equal to %s.",
        range: "This value should be between %s and %s.",
        minlength: "This value is too short. It should have %s characters or more.",
        maxlength: "This value is too long. It should have %s characters or fewer.",
        length: "This value length is invalid. It should be between %s and %s characters long.",
        mincheck: "You must select at least %s choices.",
        maxcheck: "You must select %s choices or fewer.",
        check: "You must select between %s and %s choices.",
        equalto: "This value should be the same."
    }), "undefined" != typeof window.ParsleyValidator && window.ParsleyValidator.addCatalog("en", window.ParsleyConfig.i18n.en, !0);
    var t = a.extend(new h, {
        $element: a(document),
        actualizeOptions: null,
        _resetOptions: null,
        Factory: p,
        version: "2.1.3"
    });
    return a.extend(n.prototype, h.prototype), a.extend(l.prototype, h.prototype), a.extend(p.prototype, h.prototype), a.fn.parsley = a.fn.psly = function (b) {
        if (this.length > 1) {
            var c = [];
            return this.each(function () {
                c.push(a(this).parsley(b))
            }), c
        }
        return a(this).length ? new p(this, b) : void f.warn("You must bind Parsley on an existing element.")
    }, "undefined" == typeof window.ParsleyExtend && (window.ParsleyExtend = {}), t.options = a.extend(f.objectCreate(g), window.ParsleyConfig), window.ParsleyConfig = t.options, window.Parsley = window.psly = t, window.ParsleyUtils = f, window.ParsleyValidator = new j(window.ParsleyConfig.validators, window.ParsleyConfig.i18n), window.ParsleyUI = "function" == typeof window.ParsleyConfig.ParsleyUI ? (new window.ParsleyConfig.ParsleyUI).listen() : (new k).listen(), !1 !== window.ParsleyConfig.autoBind && a(function () {
        a("[data-parsley-validate]").length && a("[data-parsley-validate]").parsley()
    }), window.Parsley
}), ! function () {
    "use strict";

    function t(o) {
        if (!o) throw new Error("No options passed to Waypoint constructor");
        if (!o.element) throw new Error("No element option passed to Waypoint constructor");
        if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
    }
    var e = 0,
        i = {};
    t.prototype.queueTrigger = function (t) {
        this.group.queueTrigger(this, t)
    }, t.prototype.trigger = function (t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, t.prototype.destroy = function () {
        this.context.remove(this), this.group.remove(this), delete i[this.key]
    }, t.prototype.disable = function () {
        return this.enabled = !1, this
    }, t.prototype.enable = function () {
        return this.context.refresh(), this.enabled = !0, this
    }, t.prototype.next = function () {
        return this.group.next(this)
    }, t.prototype.previous = function () {
        return this.group.previous(this)
    }, t.invokeAll = function (t) {
        var e = [];
        for (var o in i) e.push(i[o]);
        for (var n = 0, r = e.length; r > n; n++) e[n][t]()
    }, t.destroyAll = function () {
        t.invokeAll("destroy")
    }, t.disableAll = function () {
        t.invokeAll("disable")
    }, t.enableAll = function () {
        t.invokeAll("enable")
    }, t.refreshAll = function () {
        t.Context.refreshAll()
    }, t.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight
    }, t.viewportWidth = function () {
        return document.documentElement.clientWidth
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function () {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function () {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = t
}(),
function () {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var i = 0,
        o = {},
        n = window.Waypoint,
        r = window.onload;
    e.prototype.add = function (t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical);
        t && e && (this.adapter.off(".waypoints"), delete o[this.key])
    }, e.prototype.createThrottledResizeHandler = function () {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
            e.didResize || (e.didResize = !0, n.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function () {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
            (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function () {
        n.Context.refreshAll()
    }, e.prototype.handleScroll = function () {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var i in e) {
            var o = e[i],
                n = o.newScroll > o.oldScroll,
                r = n ? o.forward : o.backward;
            for (var s in this.waypoints[i]) {
                var a = this.waypoints[i][s],
                    l = o.oldScroll < a.triggerPoint,
                    h = o.newScroll >= a.triggerPoint,
                    p = l && h,
                    u = !l && !h;
                (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group)
            }
        }
        for (var c in t) t[c].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }, e.prototype.innerHeight = function () {
        return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function () {
        return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function () {
        var t = [];
        for (var e in this.waypoints)
            for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++) t[o].destroy()
    }, e.prototype.refresh = function () {
        var t, e = this.element == this.element.window,
            i = e ? void 0 : this.adapter.offset(),
            o = {};
        this.handleScroll(), t = {
            horizontal: {
                contextOffset: e ? 0 : i.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : i.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var r in t) {
            var s = t[r];
            for (var a in this.waypoints[r]) {
                var l, h, p, u, c, d = this.waypoints[r][a],
                    f = d.options.offset,
                    w = d.triggerPoint,
                    y = 0,
                    g = null == w;
                d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = y + l - f, h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group)
            }
        }
        return n.requestAnimationFrame(function () {
            for (var t in o) o[t].flushTriggers()
        }), this
    }, e.findOrCreateByElement = function (t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function () {
        for (var t in o) o[t].refresh()
    }, e.findByElement = function (t) {
        return o[t.waypointContextKey]
    }, window.onload = function () {
        r && r(), e.refreshAll()
    }, n.requestAnimationFrame = function (e) {
        var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
        i.call(window, e)
    }, n.Context = e
}(),
function () {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function i(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this
    }
    var o = {
            vertical: {},
            horizontal: {}
        },
        n = window.Waypoint;
    i.prototype.add = function (t) {
        this.waypoints.push(t)
    }, i.prototype.clearTriggerQueues = function () {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, i.prototype.flushTriggers = function () {
        for (var i in this.triggerQueues) {
            var o = this.triggerQueues[i],
                n = "up" === i || "left" === i;
            o.sort(n ? e : t);
            for (var r = 0, s = o.length; s > r; r += 1) {
                var a = o[r];
                (a.options.continuous || r === o.length - 1) && a.trigger([i])
            }
        }
        this.clearTriggerQueues()
    }, i.prototype.next = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints),
            o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1]
    }, i.prototype.previous = function (e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null
    }, i.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t)
    }, i.prototype.remove = function (t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }, i.prototype.first = function () {
        return this.waypoints[0]
    }, i.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1]
    }, i.findOrCreate = function (t) {
        return o[t.axis][t.name] || new i(t)
    }, n.Group = i
}(),
function () {
    "use strict";

    function t(t) {
        this.$element = e(t)
    }
    var e = window.jQuery,
        i = window.Waypoint;
    e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) {
        t.prototype[i] = function () {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[i].apply(this.$element, t)
        }
    }), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
        t[o] = e[o]
    }), i.adapters.push({
        name: "jquery",
        Adapter: t
    }), i.Adapter = t
}(),
function () {
    "use strict";

    function t(t) {
        return function () {
            var i = [],
                o = arguments[0];
            return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () {
                var n = t.extend({}, o, {
                    element: this
                });
                "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n))
            }), i
        }
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}(),
function () {
    $homeHeaderFixed = $("#home-header-fixed"), $homeHeaderFixed.length && (isMobile.any || $homeHeaderFixed.affix({
        offset: {
            top: $homeHeaderFixed.offset().top
        }
    })), $(document).ready(function () {
        $("#testimonials-slider").slick({
            arrows: !0,
            prevArrow: '<button type="button" class="btn btn-link testimonial-prev no-padding"><span class="chevron-left"></span><span class="sr-only">Previous</span></button>',
            nextArrow: '<button type="button" class="btn btn-link testimonial-next no-padding"><span class="chevron-right"></span><span class="sr-only">Previous</span></button>',
            autoplay: !0,
            autoplaySpeed: 5e3,
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: !1,
                    dots: !0
                }
            }]
        }), $("#cities-slider").slick({
            centerMode: !0,
            centerPadding: "0",
            arrows: !1,
            slidesToShow: 3,
            slidesToScroll: 1,
            speed: 500,
            autoplay: !0,
            autoplaySpeed: 4e3,
            responsive: [{
                breakpoint: 768,
                settings: {
                    centerMode: !1,
                    centerPadding: "0",
                    slidesToShow: 1
                }
            }]
        });
        var $getAppElement = $("#get-app");
        if ($getAppElement.length) {
            new Waypoint({
                element: $getAppElement,
                handler: function (direction) {
                    $getAppElement.find($("#phone")).focus()
                },
                offset: "bottom-in-view"
            })
        }
        $("#get-app-form").on("submit", function (event) {
            function displayStatusMessage(val) {
                "success" === val ? ($statusMessage.find(".success").fadeIn(400), setTimeout(function () {
                    $statusMessage.find(".success").fadeOut(400)
                }, 4e3)) : "failure" === val && ($statusMessage.find(".error").fadeIn(400), setTimeout(function () {
                    $statusMessage.find(".error").fadeOut(400)
                }, 2e3))
            }
            var $btn = $(this).find("button"),
                $statusMessage = $(".status-message"),
                phone = $(this).find("#phone").val(),
                phoneRegex = /^\d*$/;
            if (phoneRegex.test(phone) && 10 === phone.length) {
                var formData = {
                    number: phone
                };
                $btn.button("loading"), $.ajax({
                    type: "GET",
                    url: "http://api.tinyowl.com/user/app_download/sms",
                    data: formData,
                    dataType: "json"
                }).done(function (data) {
                    $btn.button("reset"), displayStatusMessage("success")
                }).fail(function (data) {
                    $btn.button("reset"), displayStatusMessage("failure")
                })
            } else displayStatusMessage("failure");
            event.preventDefault()
        })
    })
}(),
function () {
    $(document).ready(function () {
        $("#contact-form").on("submit", function (event) {
            event.preventDefault();
            var $name = $(this).find("#name"),
                $email = $(this).find("#email"),
                $subject = $(this).find("#subject"),
                $message = $(this).find("#message"),
                name = $.trim($name.val()),
                email = $.trim($email.val()),
                subject = $.trim($subject.val()),
                message = $.trim($message.val()),
                $btn = $(this).find("#submit");
            if ("" == name || "" == email || "" == subject || "" == message) alert("Invalid data. Please fill the fields correctly.");
            else {
                var formData = {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                };
                $btn.button("loading"), $.ajax({
                    type: "POST",
                    url: "http://api.tinyowl.com/user/web_feedback",
                    data: formData,
                    dataType: "json"
                }).done(function (data) {
                    alert("Your query has been submitted. Thank you for contacting TinyOwl."), $btn.button("reset"), $name.val(""), $email.val(""), $subject.val(""), $message.val("")
                }).fail(function (data) {
                    alert("An error occurred while processing your request. Please try again."), $btn.button("reset")
                })
            }
        })
    })
}(),
function () {
    $(document).ready(function () {
        $("#offer-terms-slider").slick({
            arrows: !0,
            prevArrow: '<button type="button" class="btn btn-link offer-terms-prev no-padding"><span class="chevron-left"></span><span class="sr-only">Previous</span></button>',
            nextArrow: '<button type="button" class="btn btn-link offer-terms-next no-padding"><span class="chevron-right"></span><span class="sr-only">Previous</span></button>',
            adaptiveHeight: !0,
            autoplay: !0,
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: !1,
                    dots: !1
                }
            }]
        });
        
    })
}();
//# sourceMappingURL=app.min.js.map