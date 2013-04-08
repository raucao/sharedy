yeoman build
cd build
git add .
git commit -a -m "Yeoman build: `date -u`"
git push 5apps_beta build:master
cd ..
