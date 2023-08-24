// this app copies labels from one group or project to another

const yargs = require('yargs');
const hideBin = require('yargs/helpers').hideBin;
const argv = yargs(hideBin(process.argv)).argv;

const type = argv.type || 'groups';

if (type !== 'groups' && type !== 'projects') {
  console.log('type must be group or projects')
  process.exit(1)
}

const from = argv.from;
const to = argv.to;

if (!from || !to) {
  console.log('from and to must be provided')
  process.exit(1)
}

const token = argv.token || process.env.ACCESS_TOKEN;
const url = argv.url

if (!token) {
  console.log('gitlab access token must be provided')
  process.exit(1)
}

if (!url) {
  console.log('gitlab url must be provided')
  process.exit(1)
}

console.log(`type: ${type}`)
console.log(`from: ${from}`)
console.log(`to: ${to}`)
console.log(`url: ${url}`)
console.log(`dry_run: ${argv.dry_run}`)

const dry_run = argv.dry_run || false

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token
  }
}

const fetchAllPages = async (url, options) => {
  let results = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(`${url}?page=${page}`, options);
    const data = await response.json();
    if (data && data.length > 0) {
      results.push(...data);
      page++;
    } else {
      hasNextPage = false;
    }
  }
  return results;
};

const getLabels = async (url, options) => {
  const labels = await fetchAllPages(url, options)
  return labels
}

const copyLabels = async (url, labels) => {
  for (const label of labels) {
    const { name, color, description } = label
    const data = {
      name,
      color,
      description
    }
    if (dry_run == true) {
      console.log(data)
      continue
    } else {
      // fetch all pages of labels
      fetch(`${url}/api/v4/${type}/${to}/labels?per_page=100`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-TOKEN": token
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        // .then(data => console.log(data))
        .catch(err => console.log(err))
    }
  }
}


async function main() {
  console.log("getting source labels")
  const sourceLabels = await getLabels(`${url}/api/v4/${type}/${from}/labels`, options)
  console.log("getting target labels")
  const targetLabels = await getLabels(`${url}/api/v4/${type}/${to}/labels`, options)
  Promise.all([sourceLabels, targetLabels]).then(([sourceLabels, targetLabels]) => {
    const sourceLabelNames = sourceLabels.map(label => label.name)
    const targetLabelNames = targetLabels.map(label => label.name)
    const labelsToCreate = sourceLabelNames.filter(label => !targetLabelNames.includes(label))
    console.log("creating labels")
    copyLabels(`${url}/api/v4/${type}/${to}/labels`, labelsToCreate)
  })
}

main()