System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EmailTracker, Credential;
    return {
        setters:[],
        execute: function() {
            EmailTracker = (function () {
                function EmailTracker() {
                    this.email = '';
                }
                return EmailTracker;
            }());
            exports_1("EmailTracker", EmailTracker);
            Credential = (function () {
                function Credential() {
                    this.email = '';
                    this.password = '';
                }
                return Credential;
            }());
            exports_1("Credential", Credential);
        }
    }
});
//# sourceMappingURL=email.js.map