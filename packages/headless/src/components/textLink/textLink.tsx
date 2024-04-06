import {Text} from 'react-native';
import {useEvent} from '@legoo/hooks';
import React, {useMemo} from 'react';

export interface ITextWithLinkProps {
  children: string;
  tagName?: string;
  className?: string;
  textClassName?: string;
  linkClassName?: string;
  onLinkPress?: (linkIndex: number) => void;
}

type TextOrLink = {
  content: string;
  isLink: boolean;
  linkIndex?: number;
};

function splitTextWithLink(str: string, tagName: string) {
  let linkIndex = 0;
  const result: TextOrLink[] = [];
  const reg = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`);
  while (str) {
    const matched = str.match(reg);
    if (matched) {
      const index = matched.index;
      const [origin, content] = matched;
      if (index) {
        result.push({
          content: str.substr(0, index),
          isLink: false,
        });
      }
      if (content) {
        result.push({
          content: content,
          isLink: true,
          linkIndex: linkIndex++,
        });
      }
      str = str.substr((index ?? 0) + origin.length, str.length);
    } else {
      result.push({
        content: str.substr(0, str.length),
        isLink: false,
      });
      str = '';
    }
  }
  return result;
}

const TextWithLink: React.FC<ITextWithLinkProps> = props => {
  const {
    children,
    tagName,
    className,
    textClassName,
    linkClassName,
    onLinkPress,
  } = props;
  const textOrLink = useMemo(() => {
    return splitTextWithLink(children, tagName!);
  }, [children, tagName]);
  const _onLinkPress = useEvent((linkIndex: number) => {
    onLinkPress?.(linkIndex);
  });
  return (
    <Text className={className}>
      {textOrLink.map(({isLink, content, linkIndex}, index) => {
        return (
          <Text
            key={index}
            className={isLink ? linkClassName : textClassName}
            onPress={isLink ? () => _onLinkPress(linkIndex!) : undefined}>
            {content}
          </Text>
        );
      })}
    </Text>
  );
};

TextWithLink.displayName = 'TextWithLink';

TextWithLink.defaultProps = {
  tagName: 'a',
  textClassName: 'text-xs',
  linkClassName: 'text-xs text-primary underline',
};

export default TextWithLink;
