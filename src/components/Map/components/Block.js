import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'gatsby';

import ga from '../../../analytics';
import { makeExpandedBlockSelector, toggleBlock } from '../redux';
import { userSelector, currentChallengeIdSelector } from '../../../redux/app';
import Caret from '../../icons/Caret';
/* eslint-disable max-len */
import GreenPass from '../../../templates/Challenges/components/icons/GreenPass';
import GreenNotCompleted from '../../../templates/Challenges/components/icons/GreenNotCompleted';
/* eslint-enable max-len */
const mapStateToProps = (state, ownProps) => {
  const expandedSelector = makeExpandedBlockSelector(ownProps.blockDashedName);

  return createSelector(
    expandedSelector,
    userSelector,
    currentChallengeIdSelector,
    (isExpanded, { completedChallenges = [] }, currentChallengeId) => ({
      isExpanded,
      currentChallengeId,
      completedChallenges: completedChallenges.map(({ id }) => id)
    })
  )(state);
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleBlock }, dispatch);

const propTypes = {
  blockDashedName: PropTypes.string,
  challenges: PropTypes.array,
  completedChallenges: PropTypes.arrayOf(PropTypes.string),
  currentChallengeId: PropTypes.string,
  intro: PropTypes.shape({
    fields: PropTypes.shape({ slug: PropTypes.string.isRequired }),
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      block: PropTypes.string.isRequired
    })
  }),
  isExpanded: PropTypes.bool,
  toggleBlock: PropTypes.func.isRequired
};

const mapIconStyle = { height: '15px', marginRight: '10px', width: '15px' };

export class Block extends PureComponent {
  constructor(...props) {
    super(...props);

    this.handleBlockClick = this.handleBlockClick.bind(this);
    this.handleChallengeClick = this.handleChallengeClick.bind(this);
    this.renderChallenges = this.renderChallenges.bind(this);
  }

  componentDidMount() {
    this.scrollToCurrentChallenge();
  }

  handleBlockClick() {
    const { blockDashedName, toggleBlock } = this.props;
    ga.event({
      category: 'Map Block Click',
      action: blockDashedName
    });
    return toggleBlock(blockDashedName);
  }

  handleChallengeClick(slug) {
    return () => {
      return ga.event({
        category: 'Map Challenge Click',
        action: slug
      });
    };
  }

  renderCheckMark(isCompleted) {
    return isCompleted ? (
      <GreenPass style={mapIconStyle} />
    ) : (
      <GreenNotCompleted style={mapIconStyle} />
    );
  }

  scrollToCurrentChallenge() {
    const currentChallengeNode = this.refs.currentChallenge;
    if (currentChallengeNode) {
      const currentChallengeDomNode = ReactDom.findDOMNode(currentChallengeNode);
      setTimeout(() => {
        currentChallengeDomNode.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }

  renderChallenges(intro = {}, challenges = [], currentChallengeId='') {
    // TODO: Split this into a Challenge Component and add tests
    // TODO: The styles badge and map-badge on the completion span do not exist
    return [intro].concat(challenges).map((challenge, i) => {
      const completedClass = challenge.isCompleted
        ? ' map-challenge-title-completed'
        : '';
      const ifCurrentChallenge = challenge.id === currentChallengeId;
      const challengeItemProps = {
        className: 'map-challenge-title' + completedClass,
        key:  'map-challenge' + challenge.fields.slug
      };
      if (ifCurrentChallenge) {
        challengeItemProps.ref = 'currentChallenge'
      }
      return (
        <li {...challengeItemProps}>
          <span className='badge map-badge'>
            {i !== 0 && this.renderCheckMark(challenge.isCompleted)}
          </span>
          <Link
            onClick={this.handleChallengeClick(challenge.fields.slug)}
            to={challenge.fields.slug}
            >
            {challenge.title || challenge.frontmatter.title}
          </Link>
        </li>
      );
    });
  }

  render() {
    const { completedChallenges, challenges, isExpanded, intro, currentChallengeId} = this.props;
    const { blockName } = challenges[0].fields;
    const challengesWithCompleted = challenges.map(challenge => {
      const { id } = challenge;
      const isCompleted = completedChallenges.some(
        completedId => id === completedId
      );
      return { ...challenge, isCompleted };
    });
    return (
      <li className={`block ${isExpanded ? 'open' : ''}`}>
        <div className='map-title' onClick={this.handleBlockClick}>
          <Caret />
          <h5>{blockName}</h5>
        </div>
        <ul>
          {isExpanded
            ? this.renderChallenges(intro, challengesWithCompleted, currentChallengeId)
            : null}
        </ul>
      </li>
    );
  }
}

Block.displayName = 'Block';
Block.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Block);
