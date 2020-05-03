function generateReleaseNotes(github, context) {


  const { owner, repo } = context.repo;
  console.log('>>', context);
  console.log('>>', owner);
  console.log('>>', repo);


  return '# What\'s changed';


}

module.exports = generateReleaseNotes;
