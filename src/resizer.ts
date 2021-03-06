/**
 * Resizer Element Interface
 * @interface
 * @class Resizer.IResizerElement
 * @classdesc Interface Description
 */
interface IResizerElement extends HTMLElement {

  /**
   * Resizer Object
   * @abstract
   * @member {Resizer} Resizer.IResizerElement#Resizer
   */
  Resizer?: Resizer;
}

/**
 * Resizer Options Interface
 * @interface
 * @class Resizer.IResizerOptions
 * @classdesc Interface Description
 */
interface IResizerOptions {

  /**
   * Width of the handle
   * @abstract
   * @member {number} Resizer.IResizerOptions#width
   */
  width?: number;

  /**
   * Classname for the handle element
   * @abstract
   * @member {string} Resizer.IResizerOptions#className
   */
  className?: string;
}

/**
 * Resizer Class
 */
class Resizer {

  /**
   * Default Options
   * @public
   * @type {{width: number}}
   */
  public static defaultOptions: IResizerOptions = {
    width: 8,
    maxWdt: 0,//最大宽度
    minWdt: 0,
    start: function(){

    }
  };

  /**
   * Removes a resizer by a container selector
   * @public
   * @static
   * @method Resizer#removeBySelector
   */
  public static removeBySelector(input): void {
    const container = Resizer.getElement(input) as IResizerElement;
    if (container.hasOwnProperty('Resizer')) {
      container.Resizer.remove();
    } else {
      throw new Error('Resizer doesn\'t exist on element');
    }
  }

  /**
   * Return an HTML
   * @param {string | Element} input
   * @return {IResizerElement} container
   */
  private static getElement(input: string | HTMLElement): IResizerElement {
    let el;

    if (!input) {
      throw new Error('Missing param, should be an element or selector');
    }

    if (typeof input === 'string') {
      el = document.querySelector(input) as HTMLElement;
      if (!el) {
        throw new Error(`Can not find element from selector ${input}`);
      }
    } else {
      el = input;
    }

    return el;
  }

  /**
   * Create the Handle HTMLElement
   * @private
   * @static
   * @method Resizer#createHandle
   * @param {string} handleClass A class name to be set on the handle
   * @return {HTMLDivElement} handle element
   */
  private static createHandle(handleClass?: string): HTMLDivElement {
    const el = document.createElement('div') as HTMLDivElement;
    el.dataset.rzHandle = handleClass || '';
    el.style.cursor = 'ew-resize';
    return el;
  }

  /**
   * Create the Ghost Element
   * @private
   * @static
   * @method Resizer#createGhost
   * @return {HTMLDivElement} ghost element
   */
  private static createGhost(): HTMLDivElement {
    const el = document.createElement('div') as HTMLDivElement;
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.bottom = '0';
    el.style.display = 'none';
    el.style.zIndex = '99999';
    return el;
  }

  /**
   * @public
   * @member {IResizerOptions} Resizer#options
   */
  public options: IResizerOptions;

  /**
   * Container Element
   * @private
   * @member {HTMLElement} Resizer#container
   */
  private container: IResizerElement;

  /**
   * Handle Element
   * @public
   * @member {HTMLDivElement} Resizer#handle
   */
  private handle: HTMLDivElement;

  /**
   * Target Element
   * @public
   * @member {HTMLElement} Resizer#target
   */
  private target: HTMLElement;

  /**
   * Offset X value when clicking on handle
   * @public
   * @member {HTMLElement} Resizer#offsetX
   */
  private offsetX: number = 0;

  /**
   * Handle visible when dragging
   * @member {HTMLDivElement} Resizer#ghost
   */
  private ghost: HTMLDivElement;

  /**
   * Current left value for the handle element in relation to it's parent (container)
   * @member {number} Resizer#handleX
   */
  private handleX: number;

  /**
   * Handle is being dragged
   * @member {boolean} Resizer#dragging
   */
  private dragging: boolean = false;

  /**
   * Resizer constructor
   * @class Resizer
   * @classdesc This class
   * @param {string | HTMLElement} containerSelector Document selector or element
   * @param {IResizerOptions} resizerOptions
   */
  constructor(
    private containerSelector: string | HTMLElement,
    private resizerOptions: IResizerOptions = {},
  ) {
    this.options = Object.assign(Resizer.defaultOptions, this.resizerOptions, {});
    this.container = Resizer.getElement(containerSelector);
    if(!this.options.maxWdt){
        this.options.maxWdt = this.container.clientWidth;
    }
    this.target = this.container.firstElementChild as HTMLElement;

    if (this.container.Resizer) {
      this.remove();
    }

    this.setup();
  }

  /**
   * This method reverses the setup and removes the Resizer from the container
   * @public
   * @method Resizer#remove
   */
  public remove(): void {
    delete this.container.Resizer;
    this.container.style.position = null;
    this.container.querySelector('[data-rz-handle]').remove();
    this.target.style.flex = null;
  }

  /**
   * 设置最大宽度
   * @public
   * @method Resizer#setMaxWdt
   */
  public setMaxWdt(maxWdt): void {
    this.options.maxWdt = maxWdt;
  }

  /**
   * @private
   * @method Resizer#setup
   */
  private setup(): void {
    this.setupDom();

    // Add events
    this.handle.addEventListener('mousedown', (e: MouseEvent) => this.onDown(e));
    this.container.addEventListener('mouseup', (e: MouseEvent) => this.onUp(e));
    this.container.addEventListener('mousemove', (e: MouseEvent) => this.onMove(e));

    this.container.Resizer = this;
  }

  /**
   * This private method sets up the DOM elements required to handle the resizer
   * @private
   * @method Resizer#setupDom
   */
  private setupDom(): void {

    // Set Container to relative positioning
    this.container.style.position = 'relative';

    // Create Handle
    this.handle = Resizer.createHandle();

    // Create Ghost
    this.ghost = Resizer.createGhost();

    // Add Ghost to Handle
    this.handle.appendChild(this.ghost);

    // Insert Handle after Target
    this.container.insertBefore(this.handle, this.target.nextElementSibling);
  }

  /**
   * Sets the dragging value
   * @private
   * @param value
   */
  private setDragging(value: boolean = true): boolean {
    if (this.dragging) {
      this.ghost.style.display = 'none';
      this.target.style.flex = `0 0 ${this.handleX}px`;
    } else {
      this.ghost.style.display = 'block';
    }
    return this.dragging = value;
  }

  /**
   * Sets the handle X position value
   * @param {number} value
   */
  private setHandleX(value: number): number {
    if (value < this.options.minWdt) {
      value = this.options.minWdt;
    }
    /**
	 * 限制最大宽度
	 */
    if (value > this.options.maxWdt) {
      value = this.options.maxWdt;
    }
    this.ghost.style.left = `${value}px`;
    return this.handleX = value;
  }

  /**
   * Handle the mousedown event on the handle element
   * @private
   * @method Resizer#onDown
   * @param {MouseEvent} e
   */
  private onDown(e: MouseEvent): void {
    e.preventDefault();
    this.options.start();
    if (!this.dragging) {
      this.offsetX = e.offsetX;
      this.setHandleX(e.pageX - this.container.getBoundingClientRect().left - this.offsetX);
      this.setDragging(true);
    }
  }

  /**
   * Handle the mouseup event on the container element
   * @private
   * @method Resizer#onUp
   * @param {MouseEvent} e
   */
  private onUp(e: MouseEvent): void {
    e.preventDefault();
    if (this.dragging) {
      this.setHandleX(e.pageX - this.container.getBoundingClientRect().left - this.offsetX);
      this.setDragging(false);
    }
  }

  /**
   * Handle the mousemove event on the container element
   * @private
   * @method Resizer#onMove
   * @param {MouseEvent} e
   */
  private onMove(e: MouseEvent): void {
    e.preventDefault();
    if (this.dragging) {
      let x = e.pageX - this.container.getBoundingClientRect().left - this.offsetX;
      if (e.shiftKey) {
        x = Math.ceil(x / 20) * 20;
      }
      this.setHandleX(x);
    }
  }
}
