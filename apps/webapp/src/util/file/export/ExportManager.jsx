import DownloadManager from './DownloadManager';

class ExportManager {
  constructor() {
    this._exporters = new Map();
    this._exportTypes = [];

    this._downloaderManager = new DownloadManager();
  }

  /**
   * Register exporter for the export type(s). There can only be an exporter for
   * each export type, but there can be multiple export types per exporter. If the
   * export type is already registered, this will replace it with the new exporter.
   *
   * @param {Exporter} exporter       the exporter associated with the export type
   * @param {...String} exportTypes   the export type for the exporter (NOT the same as file type)
   * @returns {this}
   */
  registerExporter(exporter, ...exportTypes) {
    for (const exportType of exportTypes) {
      this._exporters.set(exportType, exporter);
      this._exportTypes.push(exportType);
    }

    return this;
  }

  /**
   * Removes the exporter and any associated export types from the available
   * export options.
   *
   * @param {Exporter} exporter the exporter to remove
   * @returns {Array.<String>} a list of associated export types
   */
  unregisterExporter(exporter) {
    const dst = [];
    for (const exportType of this._exporters.keys()) {
      if (this._exporters.get(exportType) === exporter) {
        dst.push(exportType);
      }
    }

    for (const exportType of dst) {
      this.unregisterExportType(exportType);
    }
    return dst;
  }

  /**
   * Removes the export type as an available export option. The associated exporter
   * will also be removed, but if it was also registered to other export types, those
   * are not changed. Use unregisterExporter() to remove everything related to the
   * exporter.
   *
   * @param {String} exportType the export type to remove
   * @returns {Exporter} the exporter associated with the export type
   */
  unregisterExportType(exportType) {
    const dst = this._exporters.get(exportType);
    this._exporters.delete(exportType);

    // Remove export type
    const index = this._exportTypes.indexOf(exportType);
    this._exportTypes.splice(index, 1);

    return dst;
  }

  /**
   * Removes all exporters and export types.
   */
  clear() {
    this._exporters.clear();
    this._exportTypes.length = 0;
  }

  /**
   * Tries to export the target to file.
   *
   * @param {String} exportType the export type for the target
   * @param {*} target the target to export to data
   * @returns {Promise} a Promise that will resolve if the target is successfully exported to file.
   */
  tryExportFile(exportType, target) {
    return this.tryExportTargetToData(exportType, target)
      .then((result) =>
        this._downloaderManager.tryDownloadFile(
          result['name'],
          result['type'],
          result['data'],
          result
        )
      )
      .catch((err) => {
        throw new Error('Failed to export target to data:' + err.message);
      });
  }

  /**
   * Tries to export the target to export data.
   *
   * @param {String} exportType the export type for the target
   * @param {*} target the target to export to data
   * @returns {Promise} a Promise that will resolve if the target is successfully processed to a valid export data.
   */
  tryExportTargetToData(exportType, target) {
    if (!this._exporters.has(exportType))
      throw new Error('Unable to export unregistered export type');

    const exporter = this._exporters.get(exportType);
    return exporter.exportTarget(exportType, target);
  }

  /**
   * Gets the associated exporter for the export type.
   *
   * @param {String} exportType the registered export type
   * @returns {Exporter} the associated exporter
   */
  getExporterByExportType(exportType) {
    return this._exporters.get(exportType);
  }

  /**
   * Gets the available registered export types in order.
   *
   * @returns {Array.<String>} an array of export types
   */
  getExportTypes() {
    return this._exportTypes;
  }

  /**
   * Gets the available registered exporters. This is, however, NOT in order.
   *
   * @returns {Iterable.<Exporter>} a collection of exporters
   */
  getExporters() {
    return this._exporters.values();
  }

  /**
   * @returns {Boolean} whether there are available importers of any file type
   */
  isEmpty() {
    return this._exporters.size <= 0;
  }
}

export default ExportManager;
