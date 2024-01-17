import type {TraverseOptions} from '@babel/traverse';
import type {
  JSXIdentifier,
  JSXExpressionContainer,
  Identifier,
  Expression,
  PatternLike,
  UnaryExpression,
  BinaryExpression,
  ConditionalExpression,
  CallExpression,
  JSXEmptyExpression,
} from '@babel/types';
import {addDefault} from '@babel/helper-module-imports';
import {propertyRecord} from './const';
import {PropertyDirection} from 'index';
import packageInfo from '../../package.json';
import * as Babel from '@babel/core';

export interface TraverseState {
  unit: string;
}

const t = Babel.types;

function getPropertyDirection(
  name: string | JSXIdentifier,
): PropertyDirection | null {
  if (typeof name === 'string') {
    return propertyRecord[name];
  }
  return null;
}

function generateExpression(
  path: Babel.NodePath,
  oriValue: Babel.types.Expression,
  direction: PropertyDirection,
  wrapper?: (expression: Expression) => Babel.Node,
) {
  const expression = t.callExpression(
    t.memberExpression(
      addDefault(path, packageInfo.name),
      t.identifier('px2u'),
    ),
    [oriValue, t.numericLiteral(direction)],
  );
  return wrapper ? wrapper(expression) : expression;
}

function nodeReplaceWithNumber(
  path: Babel.NodePath<Babel.types.JSXAttribute>,
  numbericValue:
    | number
    | UnaryExpression
    | BinaryExpression
    | ConditionalExpression
    | CallExpression,
  propertyDirection: PropertyDirection,
  wrapper?: (expression: Expression) => Babel.Node,
) {
  path
    .get('value')
    .replaceWith(
      generateExpression(
        path,
        typeof numbericValue === 'number'
          ? t.numericLiteral(numbericValue)
          : numbericValue,
        propertyDirection,
        wrapper,
      ),
    );
}

function processRelatedPropertyValue(
  path: Babel.NodePath<any>,
  expressionNode: Expression | JSXEmptyExpression | PatternLike,
  propertyDirection,
  state: TraverseState,
  wrapper?: (expression: Expression) => Babel.Node,
) {
  if (t.isNumericLiteral(expressionNode)) {
    // width={100}
    nodeReplaceWithNumber(
      path,
      expressionNode.value,
      propertyDirection,
      wrapper,
    );
  } else if (
    t.isStringLiteral(expressionNode) &&
    expressionNode.value.endsWith(state.unit)
  ) {
    // width={'100px'}
    const numbericValue = +expressionNode.value.replace(state.unit, '');
    if (isNaN(numbericValue)) return;
    nodeReplaceWithNumber(path, numbericValue, propertyDirection, wrapper);
  } else if (
    t.isUnaryExpression(expressionNode) ||
    t.isBinaryExpression(expressionNode) ||
    t.isConditionalExpression(expressionNode)
  ) {
    // width={+100} width={50+50} width={true ? 100 : 0}
    nodeReplaceWithNumber(path, expressionNode, propertyDirection, wrapper);
  } else if (
    t.isTemplateLiteral(expressionNode) &&
    expressionNode.quasis[expressionNode.quasis.length - 1].value.raw.endsWith(
      state.unit,
    )
  ) {
    if (expressionNode.expressions.length === 1) {
      const firstExpression = expressionNode.expressions[0];
      if (t.isBinaryExpression(firstExpression)) {
        // width={`${50 + 50}px`}
        nodeReplaceWithNumber(
          path,
          firstExpression,
          propertyDirection,
          wrapper,
        );
      } else if (
        t.isNumericLiteral(firstExpression) ||
        t.isStringLiteral(firstExpression)
      ) {
        // width={`${50}px`}
        if (isNaN(+firstExpression.value)) return;
        nodeReplaceWithNumber(
          path,
          +firstExpression.value,
          propertyDirection,
          wrapper,
        );
      }
    } else if (expressionNode.expressions.length === 0) {
      // width={`100px`}
      const rawValue =
        expressionNode.quasis[expressionNode.quasis.length - 1].value.raw;
      const numbericValue = +rawValue.replace(state.unit, '');
      if (isNaN(numbericValue)) return;
      nodeReplaceWithNumber(path, numbericValue, propertyDirection, wrapper);
    }
  } else if (
    t.isCallExpression(expressionNode) &&
    (expressionNode.callee as Identifier).name !== 'ori' &&
    (expressionNode.callee as Identifier).name !== 'px2u'
  ) {
    // width={sum(40, 60)} width={Number(100)}
    nodeReplaceWithNumber(path, expressionNode, propertyDirection, wrapper);
  }
}

const visitor: TraverseOptions<TraverseState> = {
  JSXAttribute(path, state) {
    const propertyName = path.node.name.name;
    if (propertyName == null) return;
    const propertyDicrecion = getPropertyDirection(propertyName);
    if (propertyDicrecion == null) return;
    const expressionNode = (path.node.value as JSXExpressionContainer)
      .expression;
    processRelatedPropertyValue(
      path,
      expressionNode,
      propertyDicrecion,
      state,
      t.jSXExpressionContainer,
    );
  },
  ObjectProperty(path, state) {
    let propertyName: string | null = null;
    if (t.isIdentifier(path.node.key)) {
      propertyName = path.node.key.name;
    } else if (t.isStringLiteral(path.node.key)) {
      propertyName = path.node.key.value;
    }
    if (propertyName == null) return;
    const propertyDicrecion = getPropertyDirection(propertyName);
    if (propertyDicrecion == null) return;
    processRelatedPropertyValue(
      path,
      path.node.value,
      propertyDicrecion,
      state,
    );
  },
};

export default visitor;
