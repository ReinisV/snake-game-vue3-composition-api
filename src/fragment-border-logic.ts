import { Direction, getOppositeDirection, isVerticalDirection, directionsAreNextToEachOther } from './game-logic';
import { mapDirectionToBorderProp } from './screen-logic';

const defaultBorderValue = '40px';

type BorderObject = {
  'top-left': number,
  'top-right': number,
  'bottom-right': number,
  'bottom-left': number
};

function buildStringFromBorderValues(borderValues: BorderObject): string {
  return `${borderValues['top-left']} ${borderValues['top-right']} ${borderValues['bottom-right']} ${borderValues['bottom-left']}`;
}

function getRoundedOppositeCornerBorderValues(payload: {
  prevDirection: Direction,
  nextDirection: Direction
}) {
  const { prevDirection, nextDirection } = payload;
  // get the opposite corner for rounding
  const oppositePrevDirection = getOppositeDirection(prevDirection);
  const oppositeNextDirection = getOppositeDirection(nextDirection);

  if (isVerticalDirection(oppositePrevDirection)) {
    // vertical always goes first
    const fieldName = `${mapDirectionToBorderProp(oppositePrevDirection)}-${mapDirectionToBorderProp(oppositeNextDirection)}`;

    return { [fieldName]: defaultBorderValue };
  } else {
    // vertical always goes first
    const fieldName = `${mapDirectionToBorderProp(oppositeNextDirection)}-${mapDirectionToBorderProp(oppositePrevDirection)}`;

    return { [fieldName]: defaultBorderValue };
  }
}

function getRoundedOppositeEndBorderValues(direction: Direction) {
  const oppositeNextDirection = getOppositeDirection(direction);
  if (isVerticalDirection(oppositeNextDirection)) {
    // if is 'top' or 'bottom'
    const fieldName1 = `${mapDirectionToBorderProp(oppositeNextDirection)}-${mapDirectionToBorderProp('left')}`;
    const fieldName2 = `${mapDirectionToBorderProp(oppositeNextDirection)}-${mapDirectionToBorderProp('right')}`;

    return {
      [fieldName1]: defaultBorderValue,
      [fieldName2]: defaultBorderValue
    };
  } else {
    const fieldName1 = `${mapDirectionToBorderProp('up')}-${mapDirectionToBorderProp(oppositeNextDirection)}`;
    const fieldName2 = `${mapDirectionToBorderProp('down')}-${mapDirectionToBorderProp(oppositeNextDirection)}`;
    return {
      [fieldName1]: defaultBorderValue,
      [fieldName2]: defaultBorderValue
    };
  }
}

export function getBorderPropBasedOnDirections(payload: {
  prevDirection: Direction | null,
  nextDirection: Direction | null
}): string {
  const { prevDirection, nextDirection } = payload;

  let borderValues = {
    'top-left': 0,
    'top-right': 0,
    'bottom-right': 0,
    'bottom-left': 0
  };

  if (prevDirection !== null &&
    nextDirection !== null &&
    directionsAreNextToEachOther(prevDirection, nextDirection)) {
    // if is mid fragment
    const roundedCornerBorderValues = getRoundedOppositeCornerBorderValues({
      prevDirection: prevDirection,
      nextDirection: nextDirection,
    });

    borderValues = {
      ...borderValues,
      ...roundedCornerBorderValues
    };
  } else if (nextDirection !== null &&
    prevDirection === null) {
    // if is end fragment
    const roundedEndBorderValues = getRoundedOppositeEndBorderValues(nextDirection);

    borderValues = {
      ...borderValues,
      ...roundedEndBorderValues
    };
  } else if (nextDirection === null &&
    prevDirection !== null) {
    // if is start fragment
    const roundedEndBorderValues = getRoundedOppositeEndBorderValues(prevDirection);

    borderValues = {
      ...borderValues,
      ...roundedEndBorderValues
    };
  }

  return buildStringFromBorderValues(borderValues);
}
