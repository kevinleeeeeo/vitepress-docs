
#!/usr/bin/env sh

# abort on errors
set -e

node -v


# build
npm run docs:build

# navigate into the build output directory
cd docs/.vitepress/dist

# if you are deploying to a custom domain
# echo 'study.dt-code.fun' > CNAME

# git init
# git add -A
# git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
# just a example, please change the follow line with your github account!!!
#  git push -f https://gitee.com/kevinleeeee/vitepress-docs-site.git main:gh-pages

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
``
cd -
# rm -rf docs/.vitepress/dist