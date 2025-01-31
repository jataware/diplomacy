module.exports = {
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es6":     true,
        "browser": true,
        "node":    true,
        "mocha":   true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "semi": [2, "always", { "omitLastInOneLineBlock": true}],
        "no-prototype-builtins": "off",
        "no-loss-of-precision": "off",
        // "no-unused-vars": ["warn", { "ignoreRestSiblings": true }]
    }
};
