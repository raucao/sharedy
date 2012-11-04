# echo "build" >> .gitignore
# git add .gitignore
# git commit -m "Update gitignore config"
git up
git push origin master
mkdir build
cd build
git clone ssh://git@bitbucket.org/skddc/sharedy.git .
git checkout -b build
rm -rf `find . | grep -v ".git/" | grep -v ".git$"`
git add .
git commit -a -m "Remove all files except .git"
git push origin build
cd ..
