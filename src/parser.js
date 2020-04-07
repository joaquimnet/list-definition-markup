function err(msg, line) {
  return msg + `\n${line.line}: ${line.raw}`;
}

function splitLines(raw) {
  return raw.split("\n").map((l) => l.trimRight());
}

function parseIndentations(line) {
  let spaces = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== " ") {
      break;
    }
    spaces++;
  }
  return [spaces, spaces / 2];
}

function hasChildren(valueData, line) {
  return valueData[0].indentations > line.indentations;
}

function deepKey(object, keyPath) {
  let obj = object;
  if (!keyPath.length) {
    return object;
  }
  for (let i = 0; i < keyPath.length; i++) {
    obj = obj[keyPath[i]];
  }
  return obj;
}

module.exports = (raw) => {
  const lines = splitLines(raw);

  const parsedLines = lines
    .map((line, index) => {
      const [spaces, indentations] = parseIndentations(line);
      if (spaces % 2 !== 0) {
        throw new SyntaxError(
          err(`Bad indentation`, { line: index + 1, raw: line })
        );
      }
      if ((index === 0) & (indentations !== 0)) {
        throw new SyntaxError(
          err(`Bad indentation`, { line: index, raw: line })
        );
      }
      return {
        indentations,
        raw: line.substring(spaces),
        line: index + 1,
      };
    })
    // Remove empty lines
    .filter((l) => l.raw.length);

  parsedLines.forEach((line, index, array) => {
    const previousLine = array[index - 1];
    if (previousLine && line.indentations - previousLine.indentations > 1) {
      throw new SyntaxError(err("Bad indentation", line));
    }
  });

  let finalObject = {};
  let path = [];

  while (parsedLines.length) {
    const currentLine = parsedLines.shift();

    while (currentLine.indentations !== path.length) {
      path.pop();
    }

    const obj = deepKey(finalObject, path);

    if (parsedLines.length && hasChildren(parsedLines, currentLine)) {
      obj[currentLine.raw] = {};
      path.push(currentLine.raw);
    } else {
      obj[currentLine.raw] = currentLine.raw;
    }
  }

  return finalObject;
};
