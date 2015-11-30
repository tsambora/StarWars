declare module materialize {

var ngMaterialize: ng.IModule;
interface IModalService {
    open(options: IModalOptions): IModalPromise<any>;
    open<T>(options: IModalOptions): IModalPromise<T>;
}
interface IModalOptions {
    /**
     * The title of the modal. If this option is present, a default header will be inserted into the template.
     */
    title?: string;
    /**
     * The scope to derive from. If not passed, the $rootScope is used
     */
    scope?: ng.IScope;
    /**
     * Objects to pass to the controller as $modalInstance.params
     */
    params?: any;
    /**
     * The HTML of the view. Overriden by @templateUrl property
     */
    template?: string | (() => string);
    /**
     * The URL of the view. Overrides @template
     */
    templateUrl?: string | (() => string);
    /**
     * TRUE if the modal should have a fixed footer
     */
    fixedFooter?: boolean;
    /**
     * A controller definition
     */
    controller?: Function | string;
    /**
     * The controller alias for the controllerAs sintax. Requires @controller
     */
    controllerAs?: string;
    /**
     * One or more space-separated css classes to add to the generated .modal element.
     * @see {@link https://github.com/viniciusmelquiades/ngMaterialize/issues/2}
     */
    cssClass?: string;
}
interface IModalInstance {
    params: any;
    close(result?: any): any;
    dismiss(reason?: any): any;
}
interface IModalScope extends ng.IScope {
    params?: any;
    $close?(result?: any): any;
    $dismiss?(reason?: any): any;
}
interface IModalPromise<T> extends ng.IPromise<T> {
    close<T>(result?: T): any;
    dismiss(reason?: any): any;
}
function ModalService(q: ng.IQService, http: ng.IHttpService, controller: ng.IControllerService, timeout: ng.ITimeoutService, rootScope: ng.IRootScopeService, compile: ng.ICompileService): IModalService;
function MaterialSelect($timeout: ng.ITimeoutService): ng.IDirective;

}