const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_$'.split('').reduce((o, l) => { o[l] = 1; return o }, {});

function parse(path: string) {
  const pathParts = createParser(path);

  return (object: any) => {
    if (!path) {
      return object;
    }

    let value = object;

    for (let i = 0; i < pathParts.length; i++) {
      value = value[pathParts[i]];
    }
    return value;
  }
}


function createParser(path: string) {
  const parts: string[] = [];
  const word: string[] = [];
  let char = '';
  let bracesOpen: boolean = false;

  function finishWordIfNotEmpty() {
    if (word.length > 0) {
      parts.push(word.join(''));
      word.length = 0;
    }
  }

  for (let i = 0; i < path.length; i++) {
    char = path[i];
    switch(char) {
      case '.':
        finishWordIfNotEmpty();
        break;
      case '[':
        if (bracesOpen) {
          throw 'Parse error: unexpected character "["';
        }
        finishWordIfNotEmpty();
        bracesOpen = true;
        break;
      case ']':
        if (!bracesOpen || word.length === 0) {
          throw 'Parse error: unexpected character "]"';
        }
        finishWordIfNotEmpty();
        bracesOpen = false;
        break;
      default:
        if (!validChars[char]) {
          throw `Parse error: invalid character ${char}`;
        }
        word.push(char);
    }
  }
  if (bracesOpen) {
    throw 'Parse error: unclosed brace "[" found';
  }
  finishWordIfNotEmpty();

  return parts;
}

export default parse;
