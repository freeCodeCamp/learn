/* global graphql */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';

import FullWidthRow from '../../components/util/FullWidthRow';
import ButtonSpacer from '../../components/util/ButtonSpacer';
import { toggleMapModal } from '../../redux/app';
import { MarkdownRemark, AllChallengeNode } from '../../redux/propTypes';

import './intro.css';

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleMapModal }, dispatch);

const propTypes = {
  data: PropTypes.shape({
    markdownRemark: MarkdownRemark,
    allChallengeNode: AllChallengeNode
  }),
  toggleMapModal: PropTypes.func.isRequired
};

function renderMenuItems({ edges = [] }) {
  return edges.map(({ node }) => node).map(({ title, fields: { slug } }) => (
    <Link key={'intro-' + slug} to={slug}>
      <ListGroupItem>{title}</ListGroupItem>
    </Link>
  ));
}

function IntroductionPage({
  data: { markdownRemark, allChallengeNode },
  toggleMapModal
}) {
  const { html, frontmatter: { block } } = markdownRemark;
  const firstLesson = allChallengeNode && allChallengeNode.edges[0].node;
  const firstLessonPath = firstLesson
    ? firstLesson.fields.slug
    : '/strange-place';
  return (
    <Fragment>
      <Helmet>
        <title>{block} | freeCodeCamp</title>
      </Helmet>
      <FullWidthRow>
        <div
          className='intro-layout'
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </FullWidthRow>
      <FullWidthRow>
        <Link to={firstLessonPath}>
          <Button block={true} bsSize='lg' bsStyle='primary'>
            Go to the first lesson
          </Button>
        </Link>
        <ButtonSpacer />
        <Button block={true} bsSize='sm' onClick={toggleMapModal}>
          View the curriculum
        </Button>
        <hr />
      </FullWidthRow>
      <FullWidthRow>
        <h2 className='intro-toc-title'>Upcoming Lessons</h2>
        <ListGroup className='intro-toc'>
          {allChallengeNode ? renderMenuItems(allChallengeNode) : null}
        </ListGroup>
      </FullWidthRow>
    </Fragment>
  );
}

IntroductionPage.displayName = 'IntroductionPage';
IntroductionPage.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export const query = graphql`
  query IntroPageBySlug($slug: String!, $block: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        block
      }
      html
    }
    allChallengeNode(
      filter: { block: { eq: $block } }
      sort: { fields: [superOrder, order, suborder] }
    ) {
      edges {
        node {
          fields {
            slug
          }
          title
        }
      }
    }
  }
`;
