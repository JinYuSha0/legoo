import type {PluginObj, PluginPass} from '@babel/core';
import {normalizePath, relativePath, removeStartSep} from './helper';
import micromatch from 'micromatch';
import * as Babel from '@babel/core';
import visitor, {type TraverseState} from './visitor';

interface InputParams {
  include: string[];
  exclude?: string[];
  unit?: string;
}

interface InnerAttribute {}

export default function (
  {types: t}: typeof Babel,
  opt: InputParams,
): PluginObj<PluginPass & InnerAttribute> {
  return {
    name: 'babel-plugin-rn-screen-adaption',
    visitor: {
      Program: {
        enter(path, state) {
          const cwd = process.cwd();
          const excludeFiles = (opt.exclude ?? []).map(path =>
            normalizePath(removeStartSep(relativePath(cwd, path))),
          );
          const includeFiles = opt.include.map(path =>
            normalizePath(removeStartSep(relativePath(cwd, path))),
          );
          const relativeFilename = normalizePath(
            removeStartSep(relativePath(cwd, state.filename)),
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
