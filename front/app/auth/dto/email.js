System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Email, Credential, User;
    return {
        setters:[],
        execute: function() {
            Email = (function () {
                function Email() {
                    this.email = '';
                }
                return Email;
            }());
            exports_1("Email", Email);
            Credential = (function () {
                function Credential() {
                    this.email = '';
                    this.password = '';
                }
                return Credential;
            }());
            exports_1("Credential", Credential);
            User = (function () {
                function User() {
                    this.username = '';
                    this.password = '';
                    this.email = '';
                    this.tracker = '';
                }
                return User;
            }());
            exports_1("User", User);
        }
    }
});
//# sourceMappingURL=email.js.map