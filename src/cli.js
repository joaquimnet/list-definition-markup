#!/usr/bin/env node

const yargs = require('yargs');
const { bold, red, greenBright } = require('chalk');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const parse = require('./parser');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

const usage = bold('$0 <path> [--option]');
const error = red(bold('Error! '));

const pathWithoutExtension = filePath => {
  const pathParts = filePath.split(/(\\|\/)/g);
  const fileName = pathParts[pathParts.length - 1];

  if (!fileName.includes('.') || fileName[0] === '.') {
    return filePath;
  }

  const fileNameParts = fileName.split('.');

  pathParts.pop();
  fileNameParts.pop();

  return pathParts.join('') + fileNameParts.join('.');
};

const pathExistsAndIsDir = filePath => {
  return (
    fs.existsSync(path.resolve(filePath)) &&
    fs.statSync(path.resolve(filePath)).isDirectory()
  );
};

const args = yargs
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'File to save the output to',
  })
  .option('dry', {
    alias: 'd',
    type: 'boolean',
    description: 'Will not write result to file.',
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Outputs debugging information to the console.',
  })
  .usage(usage).argv;

if (args.verbose) {
  console.log(args);
}

if (!args._[0]) {
  console.log(
    error,
    "You're missing the path argument:\n",
    usage.replace('$0', args['$0']),
  );
  return;
}

const inputFilePath = path.resolve(args._[0]);

if (!fs.existsSync(inputFilePath)) {
  console.log(error, `File at ${args._[0]} not found.`);
  return;
}

if (fs.statSync(inputFilePath).isDirectory()) {
  console.log(error, `${args._[0]} is a directory not a file.`);
  return;
}

read(path.resolve(args._[0]), { encoding: 'utf8' }).then(file => {
  let parsedContent;
  try {
    parsedContent = parse(file);
  } catch (err) {
    console.log(
      red(bold('Failed to parse contents of file!')),
      '\n',
      err.message,
    );
    return;
  }

  parsedContent = JSON.stringify(parsedContent, null, 2);

  let output;

  if (args.output) {
    if (pathExistsAndIsDir(args.output)) {
      const fileName = path
        .resolve(args._[0])
        .split(/(\\|\/)/g)
        .pop();
      output = path.resolve(args.output) + '/' + fileName;
    } else {
      output = path.resolve(args.output);
    }
    output = pathWithoutExtension(output) + '.json';
  } else {
    output = path.resolve(args._[0]);
    output = pathWithoutExtension(output) + '.json';
  }

  if (args.verbose) {
    if (args.dry) {
      console.log('Will write to (remove --dry to write):', output);
    } else {
      console.log('Writing to:', output);
    }
  }

  if (fs.existsSync(output)) {
    fs.unlinkSync(output);
  }

  if (!args.dry) {
    write(path.resolve(output), parsedContent, { encoding: 'utf8' }).then(
      () => {
        console.log(greenBright(bold('Done!')));
      },
    );
  } else {
    console.log(greenBright(bold('Done!')));
  }
});
