(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{21:function(e,t,n){e.exports=n(48)},47:function(e,t,n){},48:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(19),c=n(4),i=n(20),u=n.n(i),l=n(7),s=n.n(l),d=function(e){var t=e.onSave,n=e.text,o=e.placeholder,a=e.editing,i=e.newTodo,u=r.a.useState(n||""),l=Object(c.a)(u,2),d=l[0],p=l[1];return r.a.createElement("input",{className:s()({edit:a,"new-todo":i}),type:"text",placeholder:o,autoFocus:!0,value:d,onBlur:function(e){i||t(e.target.value)},onChange:function(e){p(e.target.value)},onKeyDown:function(e){if(13===e.which){var n=e.target.value.trim();t(n),i&&p("")}}})},p=n(6),m=n(1),f=n.n(m),T=n(2),v=n(9),E=n.n(v),O="http://5e3243cbb92d240014ea512c.mockapi.io/api/v1/",h=function(){var e=Object(T.a)(f.a.mark(function e(){var t;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.a.get("".concat(O,"/todos?page=1&limit=10&sortBy=createdAt&order=desc"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),b=function(){var e=Object(T.a)(f.a.mark(function e(t){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.completed=!t.completed,e.abrupt("return",y(t));case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),y=function(){var e=Object(T.a)(f.a.mark(function e(t){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.a.put("".concat(O,"/todos/").concat(t.id),t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),w={fetchTodos:h,toggleComplete:b,updateTodo:y,addTodo:function(){var e=Object(T.a)(f.a.mark(function e(t){var n;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.a.post("".concat(O,"/todos"),t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),deleteTodo:function(){var e=Object(T.a)(f.a.mark(function e(t){var n;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.a.delete("".concat(O,"/todos/").concat(t.id));case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()},S={UPDATE_ALL_TODOS:Symbol(),UPDATE_TODO:Symbol(),ADD_TODO:Symbol(),DELETE_TODO:Symbol()},_={fetchTodos:function(e){return Object(T.a)(f.a.mark(function t(){var n;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w.fetchTodos();case 2:n=t.sent,e({type:S.UPDATE_ALL_TODOS,payload:{todos:n}});case 4:case"end":return t.stop()}},t)}))},addTodo:function(e){return function(){var t=Object(T.a)(f.a.mark(function t(n){var o,r;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return o={text:n,completed:!1,createdAt:Date.now()},t.next=3,w.addTodo(o);case 3:r=t.sent,e({type:S.ADD_TODO,payload:{todo:r}});case 5:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},editTodo:function(e){return function(){var t=Object(T.a)(f.a.mark(function t(n,o){var r;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n.text=o,t.next=3,w.updateTodo(n);case 3:r=t.sent,e({type:S.UPDATE_TODO,payload:{todo:r}});case 5:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}()},deleteTodo:function(e){return function(){var t=Object(T.a)(f.a.mark(function t(n){var o;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w.deleteTodo(n);case 2:o=t.sent,e({type:S.DELETE_TODO,payload:{todo:o}});case 4:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},completeTodo:function(e){return function(){var t=Object(T.a)(f.a.mark(function t(n){var o;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w.toggleComplete(n);case 2:o=t.sent,e({type:S.UPDATE_TODO,payload:{todo:o}});case 4:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},completeAllTodos:function(e,t){var n=t.todos;return function(){var t=Object(T.a)(f.a.mark(function t(o){var r,a,c;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.filter(function(e){return e.completed!==o}),a=r.map(function(e){return w.updateTodo(Object(p.a)({},e,{completed:o}))}),t.next=4,Promise.all(a);case 4:c=n.map(function(e){return e.completed=o,e}),e({type:S.UPDATE_ALL_TODOS,payload:{todos:c}});case 6:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},clearCompleted:function(e,t){var n=t.todos;return Object(T.a)(f.a.mark(function t(){var o,r,a;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return o=n.filter(function(e){return!0===e.completed}),r=o.map(function(e){return w.deleteTodo(e)}),t.next=4,Promise.all(r);case 4:a=n.filter(function(e){return!e.completed}),e({type:S.UPDATE_ALL_TODOS,payload:{todos:a}});case 6:case"end":return t.stop()}},t)}))}};var D=function(e,t){var n=t.type,o=t.payload,r=void 0===o?{}:o,a=e.todos,c=r.todo;switch(n){case S.UPDATE_ALL_TODOS:return{todos:r.todos};case S.UPDATE_TODO:return{todos:a.map(function(e){return e.id===c.id?Object(p.a)({},c):e})};case S.ADD_TODO:return{todos:[c].concat(a)};case S.DELETE_TODO:return{todos:a.filter(function(e){return e.id!==c.id})};default:return e}},C=n(5),L=Object(C.b)(D,{todos:[]},_),I=Object(c.a)(L,2),j=I[0],x=I[1],A=Object(C.a)(x),g=(Object(C.d)(x),j),k=A(function(e){var t=e.addTodo;return r.a.createElement("header",{className:"header"},r.a.createElement("h1",null,"todos"),r.a.createElement(d,{newTodo:!0,onSave:function(e){0!==e.length&&t(e)},placeholder:"What needs to be done?"}))},{actionSelectors:["addTodo"]}),H=n(8),N={SET_VISIBILITY_FILTER:"SET_VISIBILITY_FILTER",SWITCH_THEME:"SWITCH_THEME"},F={setVisibilityFilter:function(e){return function(t){e({type:N.SET_VISIBILITY_FILTER,payload:{visibilityFilter:t}})}},switchTheme:function(e){return function(){e({type:N.SWITCH_THEME})}}},P={SHOW_ALL:"show_all",SHOW_COMPLETED:"show_completed",SHOW_ACTIVE:"show_active"},W={LIGHT:"light",DARK:"dark"},V={visibilityFilter:P.SHOW_ALL,theme:W.DARK};document.body.classList.add(V.theme);var U,B=function(e,t){var n=t.type,o=t.payload,r=(void 0===o?{}:o).visibilityFilter;switch(n){case N.SET_VISIBILITY_FILTER:return Object(p.a)({},e,{visibilityFilter:r});case N.SWITCH_THEME:var a=e.theme===W.LIGHT?W.DARK:W.LIGHT;return document.body.classList.replace(e.theme,a),Object(p.a)({},e,{theme:a});default:return e}},M=Object(C.b)(B,V,F),R=Object(c.a)(M,2),K=R[0],Y=R[1],G=Object(C.a)(Y),J=(Object(C.d)(Y),K),q=G(function(e){var t=e.active,n=e.children,o=e.setVisibilityFilter;return r.a.createElement("a",{className:s()({selected:t}),style:{cursor:"pointer"},onClick:function(){return o()}},n)},{stateSelectors:{active:function(e,t){var n=e.visibilityFilter;return t.filter===n}},actionSelectors:{setVisibilityFilter:function(e,t){var n=e.setVisibilityFilter;return function(){return n(t.filter)}}}}),z=(U={},Object(H.a)(U,P.SHOW_ALL,"All"),Object(H.a)(U,P.SHOW_ACTIVE,"Active"),Object(H.a)(U,P.SHOW_COMPLETED,"Completed"),U),Q=function(e){var t=e.activeCount,n=e.completedCount,o=e.onClearCompleted,a=1===t?"item":"items";return r.a.createElement("footer",{className:"footer"},r.a.createElement("span",{className:"todo-count"},r.a.createElement("strong",null,t||"No")," ",a," left"),r.a.createElement("ul",{className:"filters"},Object.keys(z).map(function(e){return r.a.createElement("li",{key:e},r.a.createElement(q,{filter:e},z[e]))})),!!n&&r.a.createElement("button",{className:"clear-completed",onClick:o},"Clear completed"))},X=function(e){var t=e.todo,n=e.editTodo,o=e.deleteTodo,a=e.completeTodo,i=r.a.useState(!1),u=Object(c.a)(i,2),l=u[0],p=u[1];return r.a.createElement("li",{className:s()({completed:t.completed,editing:l})},l?r.a.createElement(d,{text:t.text,editing:l,onSave:function(e){return function(e){0===e.length?o(t):n(t,e),p(!1)}(e)}}):r.a.createElement("div",{className:"view"},r.a.createElement("input",{className:"toggle",type:"checkbox",checked:t.completed,onChange:function(){return a(t)}}),r.a.createElement("label",{onDoubleClick:function(){p(!0)}},t.text),r.a.createElement("button",{className:"destroy",onClick:function(){return o(t)}})))};var Z=Object(C.c)([Y,x])(function(e){var t=e.todos,n=e.editTodo,o=e.deleteTodo,a=e.completeTodo,c=e.hiddenItems;return r.a.createElement("ul",{className:"todo-list"},t.map(function(e){return r.a.createElement(X,{key:e.id,todo:e,editTodo:n,deleteTodo:o,completeTodo:a})}),c>0?r.a.createElement("div",{className:"hidden-items"},c," hidden item/s by filters..."):"")},{stateSelectors:["todos","visibilityFilter"],actionSelectors:["editTodo","deleteTodo","completeTodo"],computedSelectors:{totalTodos:[function(e){return e.length},["todos"]],todos:[function(e,t){return console.log("filterVisibleTodos"),t===P.SHOW_ACTIVE?e.filter(function(e){return!e.completed}):t===P.SHOW_COMPLETED?e.filter(function(e){return e.completed}):e},["todos","visibilityFilter"]],hiddenItems:[function(e,t){return t-e.length},["todos","totalTodos"]]}}),$=A(function(e){var t=e.todosCount,n=e.completedCount,o=e.completeAllTodos,a=e.clearCompleted;return r.a.createElement("section",{className:"main"},!!t&&r.a.createElement("span",null,r.a.createElement("input",{className:"toggle-all",type:"checkbox",checked:n===t,readOnly:!0}),r.a.createElement("label",{onClick:function(){o(n!==t)}})),r.a.createElement(Z,null),!!t&&r.a.createElement(Q,{completedCount:n,activeCount:t-n,onClearCompleted:a}))},{stateSelectors:{todosCount:function(e){return e.todos.length},completedCount:function(e){return e.todos.filter(function(e){return e.completed}).length}},actionSelectors:["completeAllTodos","clearCompleted"]}),ee=G(function(e){var t=e.switchTheme,n=r.a.useState(!1),o=Object(c.a)(n,2),a=o[0],i=o[1];return r.a.createElement("div",null,r.a.createElement("div",{className:"theme-switcher"},r.a.createElement(u.a,{onChange:function(){i(!a),t()},checked:a,onColor:"#333"})),r.a.createElement("div",{className:"todoapp"},r.a.createElement(k,null),r.a.createElement($,null)))},{actionSelectors:["switchTheme"]});n(46),n(47);Object(a.render)(r.a.createElement(J,null,r.a.createElement(g,{onInit:function(e){return e.actions.fetchTodos()}},r.a.createElement(ee,null))),document.getElementById("root"))}},[[21,1,2]]]);
//# sourceMappingURL=main.52f246f5.chunk.js.map