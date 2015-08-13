/**
 * A Cursor represents a pointer to the search results. Since it's specific
 * to EasySearch it can also be used to check for valid return values.
 *
 * @type {Cursor}
 */
Cursor = class Cursor {

  /**
   * Constructor
   *
   * @param {Mongo.Cursor} mongoCursor Referenced mongo cursor
   * @param {Number}       count       Count of all documents found
   * @param {Boolean}      isReady     Cursor is ready
   *
   * @constructor
   *
   */
  constructor(mongoCursor, count, isReady = true) {
    check(mongoCursor.fetch, Function);
    check(count, Number);

    this._mongoCursor = mongoCursor;
    this._count = count;
    this._isReady = isReady;
  }

  /**
   * Fetch the search results.
   *
   * @returns {[Object]}
   */
  fetch() {
    return this._mongoCursor.fetch();
  }

  /**
   * Return count of all documents found
   *
   * @returns {Number}
   */
  count() {
    return this._count;
  }

  /**
   * Return if the cursor is ready.
   *
   * @returns {Boolean}
   */
  isReady() {
    return this._isReady;
  }

  /**
   * Return the raw mongo cursor.
   *
   * @returns {Mongo.Cursor}
   */
  get mongoCursor() {
    return this._mongoCursor;
  }
};