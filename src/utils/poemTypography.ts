import type { CSSProperties } from 'react';
import type { Poem } from '../types';

type ReadingSurface = 'reader' | 'share' | 'collection';

const TOPIC_BREAK = /[，。；：、·|／/\\]/;

export const getTopicLabel = (poem: Poem) => {
  const rawTopic = poem.tags[1] ?? poem.title;
  const firstPhrase = rawTopic.split(TOPIC_BREAK).find(Boolean)?.trim() ?? '';
  const characters = Array.from(firstPhrase);

  // A compact, complete-looking page header is preferable to an ellipsis.
  return characters.length <= 14 ? firstPhrase : characters.slice(0, 12).join('');
};

export const getPoemTypography = (poem: Poem, surface: ReadingSurface = 'reader') => {
  const longestLineLength = Math.max(1, ...poem.lines.map((line) => Array.from(line).length));
  const lineCount = poem.lines.length;
  const isLong = lineCount >= 8;
  const isShort = lineCount <= 4;

  const bodyCap = surface === 'share'
    ? isShort ? 17 : isLong ? 14 : 15
    : isShort ? 21 : isLong ? 16 : 18;
  const bodyFloor = surface === 'share' ? 12 : 12.5;
  const lineHeight = isShort ? 1.88 : isLong ? 1.66 : 1.76;

  const readingStyle = {
    fontSize: `min(${bodyCap}px, max(${bodyFloor}px, calc((100vw - 20px) / ${longestLineLength})))`,
    lineHeight,
  } as CSSProperties;

  return {
    isLong,
    titleSize: surface === 'share' ? (isLong ? '24px' : '27px') : isLong ? 'clamp(23px, 6vw, 32px)' : 'clamp(25px, 6vw, 34px)',
    readingStyle,
    bodyGapClass: isLong ? 'space-y-1.5 sm:space-y-2' : 'space-y-2.5 sm:space-y-3',
    contentGapClass: isLong ? 'gap-4 sm:gap-5' : 'gap-5 sm:gap-7',
  };
};
