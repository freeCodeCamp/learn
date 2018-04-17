const path = require('path');

const { viewTypes } = require('../challengeTypes');

const backend = path.resolve(
  __dirname,
  '../../src/templates/Challenges/backend/Show.js'
);
const classic = path.resolve(
  __dirname,
  '../../src/templates/Challenges/classic/Show.js'
);
const project = path.resolve(
  __dirname,
  '../../src/templates/Challenges/project/Show.js'
);
const intro = path.resolve(
  __dirname,
  '../../src/templates/Introduction/Intro.js'
);

const views = {
  backend,
  classic,
  modern: classic,
  project
  // quiz: Quiz
};

const getNextChallengePath = (node, index, nodeArray) => {
  const next = nodeArray[index + 1];
  return next ? next.node.fields.slug : '/';
};
const getTemplateComponent = challengeType => views[viewTypes[challengeType]];

exports.createChallengePages = createPage => ({ node }, index, thisArray) => {
  const { fields: { slug }, required = [], template, challengeType, id } = node;
  if (challengeType === 7) {
    return;
  }

  createPage({
    path: slug,
    component: getTemplateComponent(challengeType),
    context: {
      challengeMeta: {
        template,
        required,
        nextChallengePath: getNextChallengePath(node, index, thisArray),
        id
      },
      slug
    }
  });
};

exports.createIntroPages = createPage => edge => {
  const { fields: { slug } } = edge.node;
  createPage({
    path: slug,
    component: intro,
    context: {
      slug
    }
  });
};
