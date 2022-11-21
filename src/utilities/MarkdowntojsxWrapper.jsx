import React from 'react';
import Markdown from 'markdown-to-jsx';

// used to override p tags in compiled md
const ParagraphOverride = ({ children, ...props }) => <span {...props}>{children}</span>;

const MarkdownWrapper = (props) => {
  const { children, options } = props;
  return (
    <Markdown
      {...props}
      options={{
        ...options,
        disableParsingRawHTML: true,
        overrides: { p: { component: ParagraphOverride }, a: { props: { target: '_blank' } } }
      }}
    >
      {children}
    </Markdown>
  );
};

export { MarkdownWrapper as Markdown };
