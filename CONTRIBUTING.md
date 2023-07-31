# Contributing Guidelines

**Welcome to Chatbot UI!**

We appreciate your interest in contributing to our project.

Before you get started, please read our guidelines for contributing.

## Types of Contributions

We welcome the following types of contributions:

- Bug fixes
- New features
- Documentation improvements
- Code optimizations
- Translations
- Tests

## Getting Started

To get started, fork the project on GitHub and clone it locally on your machine. Then, create a new branch to work on your changes.

```
git clone https://github.com/crazydevlegend/bittensor-chatgpt.git
cd bittensor-chatgpt
git checkout -b your-branch-name
```

## Adding plugins

Before submitting your pull request, please make sure your changes pass our automated tests and adhere to our code style guidelines.

- Write detailed description about the plugin in [docs](.\docs) folder with appropriate name. (Example can be seen [Here](.\docs\open_weather.md))
- Check all commit messages are in present tense and follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines.
- Make sure the 3rd-API you are using on the plugin is available.

## Pull Request Process

1. Fork the project on GitHub.
2. Clone your forked repository locally on your machine.
3. Create a new branch from the `master` branch.
4. Make your changes on the new branch.
   - Create new file for your plugin [here](\pages\api\plugins) which will be used for 3rd-party API integration
   - Add the entry to your plugin here [here](\pages\api\plugins\index.ts#L5C6-L5C6)
   - Add environment variables required to run the plugin (i.e. API-keys, Config variables, etc.) to [here](.env.local.example)
5. Ensure that your changes adhere to our code style guidelines and pass our automated tests.
6. Commit your changes and push them to your forked repository.
7. Submit a pull request to the `master` branch of the main repository with a detailed description of your changes.
8. Ask `@crazydevlegend` for review.

## Contact

If you have any questions or need help getting started, feel free to reach out to me on [Twitter](https://twitter.com/crazydevlegend).
