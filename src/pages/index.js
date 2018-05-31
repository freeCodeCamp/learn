/* global graphql */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  ChallengeNode,
  AllChallengeNode,
  AllMarkdownRemark
} from '../redux/propTypes';
import { toggleMapModal } from '../redux/app';
import Spacer from '../components/util/Spacer';
import Map from '../components/Map';

import './index.css';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleMapModal }, dispatch);

const propTypes = {
  data: PropTypes.shape({
    challengeNode: ChallengeNode,
    allChallengeNode: AllChallengeNode,
    allMarkdownRemark: AllMarkdownRemark
  }),
  toggleMapModal: PropTypes.func.isRequired
};

const IndexPage = ({
  data: {
    challengeNode: { title, fields: { slug, blockName } },
    allChallengeNode: { edges },
    allMarkdownRemark: { edges: mdEdges }
  }
}) => (
  <div className='index-page-wrapper'>
    <Helmet title='Welcome to learn.freeCodeCamp!' />
    <Spacer />
    <Spacer />
    <h2>Welcome to the freeCodeCamp curriculum</h2>
    <p>We have thousands of coding lessons to help you improve your skills.</p>
    <p>
      You can earn verified certifications by completing each sections 6
      required projects.
    </p>
    <p>
      {'And yes - all of this is 100% free, thanks to the thousands of ' +
        'campers who '}
      <a href='https://donate.freecodecamp.org' target='_blank'>
        donate
      </a>{' '}
      to our nonprofit.
    </p>
    <h3>Not sure where to start?</h3>
    <p>
      We recommend you start at the beginning{' '}
      <Link to={slug}>{`${blockName} -> ${title}`}</Link>
    </p>
    <h3>Want to dive into our curriculum?</h3>
    <Map
      introNodes={mdEdges.map(({ node }) => node)}
      nodes={edges
        .map(({ node }) => node)
        .filter(({ isPrivate }) => !isPrivate)}
    />
  </div>
);

IndexPage.displayName = 'IndexPage';
IndexPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);

export const query = graphql`
  query FirstChallenge {
    challengeNode(order: { eq: 0 }, suborder: { eq: 1 }) {
      title
      fields {
        slug
        blockName
      }
    }
    allChallengeNode(
      filter: { isPrivate: { eq: false } }
      sort: { fields: [superOrder, order, suborder] }
    ) {
      edges {
        node {
          fields {
            slug
            blockName
          }
          id
          block
          title
          isRequired
          isPrivate
          superBlock
          dashedName
        }
      }
    }
    allMarkdownRemark(filter: { frontmatter: { block: { ne: null } } }) {
      edges {
        node {
          frontmatter {
            title
            block
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
