import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import PageHeader from './components/PageHeader/index';
import Content from './components/Content/index';

const Page = ({ title, subtitle, content }) => (
  <div className="Page">
    <PageHeader title={title} subtitle={subtitle} />
    <Content content={content} />
  </div>
);

Page.defaultProps = {
  subtitle: '',
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.string.isRequired,
};

const pageContent = new ReactiveVar('');

export default withTracker(({ content, page }) => {
  window.scrollTo(0, 0);

  Meteor.call('utility.getPage', { fileName: page }, (error, response) => {
    if (error) {
      console.warn(error);
    } else {
      pageContent.set(response);
    }
  });

  return {
    content: content || pageContent.get(),
  };
})(Page);
