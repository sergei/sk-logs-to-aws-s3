VERSION=v$(python3 -c  "import json; print(json.load(open('package.json') )['version'])")
echo Publishing version "${VERSION}"
gh release create "${VERSION}" -t "Version ${VERSION}" -n  "Version ${VERSION}"
npx npm-packlist
npm publish
