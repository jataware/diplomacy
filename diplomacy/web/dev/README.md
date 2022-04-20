
Folder that contains non-application-runtime information and files such as saves aws exports files, which contains references to the auth infra resource names. Also a sampel file of the username generator output, and any other dev-helper scripts.

# For build both on local dev and prod deployment:

Copy the appropriate `aws-exports*.js` file on this directory to `../src/aws-exports.js`. That is, for local dev, copy `aws-exports-dev.js`, renaming to aws-exports.js, and for prod deploys copy `aws-exports-prod.js` to `../src/aws-exports.js.js to`.

You may use the script `./build-cp-script.sh` to accomplish this for prod builds.
