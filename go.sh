#development mode
./node_modules/.bin/babel src/shared/components -d es5-lib
cd config
webpack
cd ..
DEBUG=ideator:* nodemon start
