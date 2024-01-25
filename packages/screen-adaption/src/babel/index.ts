import type {PluginObj, PluginPass} from '@babel/core';
import {normalizePath, relativePath, removeStartSep, resolve} from './helper';
import micromatch from 'micromatch';
import * as Babel from '@babel/core';
import visitor, {type TraverseState} from './visitor';
import visitorCss from './visitorCss';

interface InputParams {
  include: string[];
  exclude?: string[];
  unit?: string;
  tailwindcss?: string;
}

interface InnerAttribute {}

const rootPath = resolve(__dirname, '../');

export default function (
  {types: t}: typeof Babel,
  opt: InputParams,
): PluginObj<PluginPass & InnerAttribute> {
  return {
    name: 'babel-plugin-screen-adaption',
    visitor: {
      Program: {
        enter(path, state) {
          const cwd = process.cwd();
          if (!state.filename) return;
          if (state.filename.startsWith(rootPath)) return;
          const relativeFilename = normalizePath(
            removeStartSep(relativePath(cwd, state.filename)),
          );
          const tailwindcssFileName = opt.tailwindcss
            ? normalizePath(removeStartSep(relativePath(cwd, opt.tailwindcss)))
            : null;
          if (relativeFilename === tailwindcssFileName) {
            path.traverse(visitorCss);
            return;
          }
          const excludeFiles = (opt.exclude ?? []).map(path =>
            normalizePath(removeStartSep(relativePath(cwd, path))),
          );
          const includeFiles = opt.include.map(path =>
            normalizePath(removeStartSep(relativePath(cwd, path))),
          );
          const isExcludeMatch = micromatch.isMatch(
            relativeFilename,
            excludeFiles,
          );
          if (isExcludeMatch) return;
          const isIncludeMatch = micromatch.isMatch(
            relativeFilename,
            includeFiles,
          );
          if (!isIncludeMatch) return;
          const traverseState: TraverseState = {
            unit: opt.unit ?? 'px',
          };
          path.traverse(visitor, traverseState);
        },
      },
    },
  };
}
