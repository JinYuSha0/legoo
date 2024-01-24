import type {TraverseOptions} from '@babel/traverse';
import {addDefault} from '@babel/helper-module-imports';
import packageInfo from '../../package.json';
import * as Babel from '@babel/core';

const t = Babel.types;

const visitorCss: TraverseOptions = {
  CallExpression(path, state) {
    const callee = path.node.callee;
    if (
      t.isMemberExpression(callee) &&
      ((t.isIdentifier(callee.object) && callee.object.name === 'StyleSheet') ||
        (t.isMemberExpression(callee.object) &&
          t.isIdentifier(callee.object.property) &&
          callee.object.property.name === 'StyleSheet')) &&
      t.isIdentifier(callee.property) &&
      (callee.property.name === 'registerCompiled' ||
        callee.property.name === 'create')
    ) {
      path
        .get('arguments')[0]
        .replaceWith(
          t.callExpression(
            t.memberExpression(
              addDefault(path, packageInfo.name),
              t.identifier('__css'),
            ),
            [path.node.arguments[0]],
          ),
        );
    }
  },
};

export default visitorCss;
