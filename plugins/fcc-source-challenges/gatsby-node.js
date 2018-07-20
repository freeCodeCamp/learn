const chokidar = require('chokidar');
const { createChallengeNodes } = require('./create-Challenge-nodes');

exports.sourceNodes = ({ boundActionCreators, reporter }, pluginOptions) => {

  if (typeof pluginOptions.source !== 'function') {
    reporter.panic(`
"source" is a required option for fcc-source-challenges. It must be a function
that delivers challenge files to the plugin
      `);
  }
  const { createNode } = boundActionCreators;

  // Watch the json files in @freecodecamp/curriculum/dist/challenges
  // TODO consider ignoring in production.

  const watcher = chokidar.watch(pluginOptions.path + '**/*.json');
  const { source } = pluginOptions;
  const createAndProcessNodes = () =>
    source()
      .filter(nodes => nodes.some(node => node.superBlock !== 'Certificates'))
      .map(nodes => nodes.map(node => createChallengeNodes(node, reporter)))
      .map(nodes => nodes.map(node => createNode(node)))
      .subscribe();

  createAndProcessNodes();
  // If any files have changed, rebuild all challenges
  watcher.on('change', path => {
     reporter.info(`changed file at ${path}`);
     createAndProcessNodes();
  });

  // There does not seem to be a need to deal the 'ready' event, as any
  // changes before 'ready' are completely ignored by chokidar and any changes
  // after are dealt with properly.
};
