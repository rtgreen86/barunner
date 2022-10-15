module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2022,
        "sourceType": "module"
    },
    "rules": {
    },
    "overrides": [
        {
            "files": [".eslintrc.js", "webpack.config.js"],
            "env": {
                "node": true
            },
        }
    ]
};
