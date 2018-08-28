export function dasherize(name) {
  return ('' + name)
    .toLowerCase()
    .trim()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9\-\.]/gi, '')
    .replace(/\./g, '-');
}

// nameify'd strings are sometimes compared to unDasherize'd strings.  In order
// for these to match nameify should depend on unDasherize.
export function nameify(str) {
  return unDasherize(dasherize(str));
}

export function unDasherize(name) {
  return ('' + name)
    // replace dash with space
    .replace(/\-/g, ' ')
    // strip nonalphanumarics chars except whitespace
    .replace(/[^a-zA-Z\d\s]/g, '')
    .trim();
}

export const descriptionRegex = /\<blockquote|\<ol|\<h4|\<table/;
