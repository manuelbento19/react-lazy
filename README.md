
# @bentoo/react-lazy

A library designed to make it easier to implement `Lazy Loading` in `React` applications. It allows components to load only when they become visible on the screen, providing a way to monitor the entry of elements into the viewport.

With this tool, you can improve the performance of your application by reducing the initial loading time and ensuring that `only the necessary elements are loaded`. This approach contributes to a more agile and responsive user experience.

## Installation

You can install the package via NPM:

```bash
npm install @bentoo/react-lazy
```

or via Yarn:

```bash
yarn add @bentoo/react-lazy
```

or via pnpm:

```bash
pnpm add @bentoo/react-lazy
```

## Usage

Here’s a basic example of how to use `@bentoo/react-lazy` in your project:

```tsx
import React from 'react';
import { LazyComponent } from '@bentoo/react-lazy';

const App = () => {
  return (
    <div>
      <h1>My image</h1>
        <LazyComponent fallback={<h1>Loading...</h1>}>
          <img src='/myPicture.png' alt='MyPicture'/>
        </LazyComponent>
    </div>
  );
};

export default App;
```

### Props

`LazyComponent` accepts the following props:

| Prop        | Type        | Description                                                       |
|-------------|-------------|-------------------------------------------------------------------|
| `fallback`  | `ReactNode` | The content to display while the component is being loaded.       |
| `children`  | `ReactNode` | The content that will be displayed after loading.                 |

## Contribution

If you would like to contribute, feel free to open a pull request or report an issue.

1. Fork the project.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -m 'Adding new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.