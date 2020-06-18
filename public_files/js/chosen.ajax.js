// Generated by CoffeeScript 1.10.0
(function($) {
  var ajaxChosen, defaultOptions;
  defaultOptions = {
    minTermLength: 3,
    afterTypeDelay: 500,
    jsonTermKey: "term",
    keepTypingMsg: "Keep typing...",
    lookingForMsg: "Looking for"
  };
  return ajaxChosen = (function() {
    function ajaxChosen(element1, settings, callback, chosenOptions) {
      var chosenXhr;
      this.element = element1;
      chosenXhr = null;
      this.callback_function = callback;
      this.options = $.extend({}, defaultOptions, this.element.data(), settings);
      this.success = settings.success;
      this.element.chosen(chosenOptions ? chosenOptions : {});
      this.search_field = this.element.next('.chosen-container').find(".search-field > input, .chosen-search > input");
      this.is_typing = false;
      this.register_observers();
    }

    ajaxChosen.prototype.register_observers = function() {
      this.search_field.on("compositionstart", (function(_this) {
        return function(evt) {
          _this.is_typing = true;
        };
      })(this));
      this.search_field.on("compositionend", (function(_this) {
        return function(evt) {
          _this.is_typing = false;
          _this.update_list(evt);
        };
      })(this));
      this.search_field.keyup((function(_this) {
        return function(evt) {
          _this.update_list(evt);
        };
      })(this));
      return this.search_field.focus((function(_this) {
        return function(evt) {
          _this.search_field_focused(evt);
        };
      })(this));
    };

    ajaxChosen.prototype.search_field_focused = function(evt) {
      if (this.options.minTermLength === 0 && this.search_field.val().length === 0) {
        return this.update_list(evt);
      }
    };

    ajaxChosen.prototype.update_list = function(evt) {
      var _this, msg, options, val;
      if (this.is_typing) {
        return;
      }
      val = $.trim(this.search_field.val());
      msg = val.length < this.options.minTermLength ? this.options.keepTypingMsg : this.options.lookingForMsg + (" '" + val + "'");
      this.element.next('.chosen-container').find('.no-results').text(msg);
      if (val === this.search_field.data('prevVal')) {
        return false;
      }
      this.search_field.data('prevVal', val);
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (val.length < this.options.minTermLength) {
        return false;
      }
      if (this.options.data == null) {
        this.options.data = {};
      }
      this.options.data[this.options.jsonTermKey] = val;
      if (this.options.dataCallback != null) {
        this.options.data = this.options.dataCallback(this.options.data);
      }
      _this = this;
      options = this.options;
      options.success = function(data) {
        return _this.show_results(data);
      };
      return this.timer = setTimeout(function() {
        if (_this.chosenXhr) {
          _this.chosenXhr.abort();
        }
        return _this.chosenXhr = $.ajax(options);
      }, options.afterTypeDelay);
    };

    ajaxChosen.prototype.show_results = function(data) {
      var _this, items, nbItems, selected_values, val_before_trigger;
      if (this.is_typing) {
        return;
      }
      if (data == null) {
        return;
      }
      items = this.callback_function != null ? this.callback_function(data, this.search_field) : data;
      if (!items.length) {
        this.element.data().chosen.no_results_clear();
        this.element.data().chosen.no_results(this.search_field.val());
        return;
      }
      selected_values = [];
      this.element.find('option').each(function() {
        if (!$(this).is(":selected")) {
          return $(this).remove();
        } else {
          return selected_values.push($(this).val() + "-" + $(this).text());
        }
      });
      this.element.find('optgroup:empty').each(function() {
        return $(this).remove();
      });
      nbItems = 0;
      _this = this;
      $.each(items, function(i, element) {
        var group, text, value;
        nbItems++;
        if (element.group) {
          group = _this.element.find("optgroup[label='" + element.text + "']");
          if (!group.size()) {
            group = $("<optgroup />");
          }
          group.attr('label', element.text).appendTo(_this.element);
          return $.each(element.items, function(i, element) {
            var text, value;
            if (typeof element === "string") {
              value = i;
              text = element;
            } else {
              value = element.value;
              text = element.text;
            }
            if ($.inArray(value + "-" + text, selected_values) === -1) {
              return $("<option />").attr('value', value).html(text).appendTo(group);
            }
          });
        } else {
          if (typeof element === "string") {
            value = i;
            text = element;
          } else {
            value = element.value;
            text = element.text;
          }
          if ($.inArray(value + "-" + text, selected_values) === -1) {
            return $("<option />").attr('value', value).html(text).appendTo(_this.element);
          }
        }
      });
      val_before_trigger = this.search_field.val();
      this.element.trigger("chosen:updated");
      this.search_field.val(val_before_trigger);
      if (this.success != null) {
        return this.success(data);
      }
    };

    $.fn.ajaxChosen = function(options, callback, chosenOptions) {
      if (options == null) {
        options = {};
      }
      if (chosenOptions == null) {
        chosenOptions = {};
      }
      return this.each(function() {
        return new ajaxChosen($(this), options, callback, chosenOptions);
      });
    };

    return ajaxChosen;

  })();
})(jQuery);