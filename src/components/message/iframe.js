/* 自包含的 iframe 环境初始化脚本（从 src/iframe.ts 改为 JS）
   依赖：lodash(_) 与 jQuery($) 已通过 third_party.html 注入到 iframe 中。 */
(function () {
  try {
    var result = _(window);
    // 从父窗口拿到若干全局对象并挂到当前 iframe window 上
    var parentWin = window.parent || {};
    var st = _.get(parentWin, 'SillyTavern');
    var stCtx = st && typeof st.getContext === 'function' ? st.getContext() : undefined;
    result = result.set('SillyTavern', stCtx);
    result = result.set('TavernHelper', _.get(parentWin, 'TavernHelper'));
    result = result.set('toastr', _.get(parentWin, 'toastr'));
    result = result.set('log', _.get(parentWin, 'log'));
    result = result.set('YAML', _.get(parentWin, 'YAML'));
    result = result.set('z', _.get(parentWin, 'z'));
    result = result.set('EjsTemplate', _.get(parentWin, 'EjsTemplate'));
    result = result.set('Mvu', _.get(parentWin, 'Mvu'));

    // 合并 TavernHelper 本体与其 _bind 方法集（方法名去下划线前缀并绑定到当前 window）
    var th = result.get('TavernHelper');
    if (th) {
      result = result.merge(th);
      var bindMap = (th && th._bind) || {};
      result = result.merge(
        ...Object.entries(bindMap).map(function (entry) {
          var key = entry[0];
          var value = entry[1];
          try {
            return { [String(key).replace('_', '')]: (typeof value === 'function' ? value.bind(window) : value) };
          } catch (_) {
            return {};
          }
        }),
      );
    }
    result.value();

    // 释放资源事件：如果父级暴露了 eventClearAll，则在 pagehide 时调用
    if (typeof window.eventClearAll === 'function') {
      $(window).on('pagehide', window.eventClearAll);
    }
  } catch (e) {
    try { console.warn('[iframe.js] init error:', e); } catch (_) {}
  }
})();

