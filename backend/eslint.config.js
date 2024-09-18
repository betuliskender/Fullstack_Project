import js from "@eslint/js"

export default [
    js.configs.recommended,

    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "no-console": "warn",
            "no-empty": "warn",
            "quotes": ["error", double],
            "semi": ["error", always],
            "camelCase": "error",
            
        }
    }
]