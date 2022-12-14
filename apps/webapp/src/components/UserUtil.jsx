/**
 * @module UserUtil
 * @desc Contains utility functions for user-related actions.
 */

/**
 * Clears the graph with user-prompts.
 * @param {import('./App').default} app the current app.
 * @param {*} graphOnly whether to only clear the graph only.
 * @param {*} callback a callback for when it is done.
 */
export function userClearGraph(app, graphOnly = false, callback = null) {
  if (window.confirm(app.getLocale().getLocaleString('alert.graph.clear'))) {
    const module = app.getCurrentModule();
    module.getGraphController().getGraph().clear();
    if (!graphOnly) {
      app.getSession().setProjectName(null);
    }
    if (callback) callback();
  }
}
