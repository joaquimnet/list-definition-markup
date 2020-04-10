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

const log = {
  red: text => console.log(red(bold(text))),
  error: (text, extra) => console.log(red(bold('Error! ' + text)), extra || ''),
  green: text => console.log(greenBright(bold(text))),
  verbose: text => args.verbose && console.log(text),
};

log.verbose(args);

if (!args._[0]) {
  log.error(
    "You're missing the path argument:\n",
    usage.replace('$0', args['$0']),
  );
  return;
}

const inputFilePath = path.resolve(args._[0]);

if (!fs.existsSync(inputFilePath)) {
  log.error(`File at ${args._[0]} not found.`);
  return;
}

if (fs.statSync(inputFilePath).isDirectory()) {
  log.error(`${args._[0]} is a directory not a file.`);
  return;
}

read(path.resolve(args._[0]), { encoding: 'utf8' }).then(file => {
  let parsedContent;
  try {
    parsedContent = parse(file);
  } catch (err) {
    log.error('Failed to parse contents of file!', err.message);
    return;
  }

  parsedContent = JSON.stringify(parsedContent, null, 2);

  let output;

  if (args.output) {
    if (isDirectory(args.output)) {
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

  if (args.dry) {
    log.verbose('Will write to (remove --dry to write): ' + output);
  } else {
    log.verbose('Writing to: ' + output);
  }

  deleteExistingFile(output);

  if (!args.dry) {
    write(path.resolve(output), parsedContent, { encoding: 'utf8' }).then(
      () => {
        log.green('Done!');
      },
    );
  } else {
    log.green('Done!');
  }
});

function pathWithoutExtension(filePath) {
  const pathParts = filePath.split(/(\\|\/)/g);
  const fileName = pathParts[pathParts.length - 1];

  if (!fileName.includes('.') || fileName[0] === '.') {
    return filePath;
  }

  const fileNameParts = fileName.split('.');

  pathParts.pop();
  fileNameParts.pop();

  return pathParts.join('') + fileNameParts.join('.');
}

function isDirectory(filePath) {
  return (
    fs.existsSync(path.resolve(filePath)) &&
    fs.statSync(path.resolve(filePath)).isDirectory()
  );
}

function deleteExistingFile(output) {
  try {
    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }
  } catch {
    /* continue code execution */
  }
}
