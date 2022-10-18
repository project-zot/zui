import React from 'react';
import Markdown from 'markdown-to-jsx';

const MarkdownWrapper = (props) => {
  const { children, options } = props;
  return (
    <Markdown {...props} options={{ ...options, overrides: { a: { props: { target: '_blank' } } } }}>
      {children}
    </Markdown>
  );
};

export { MarkdownWrapper as Markdown };
