
# @bentoo/react-lazy

Uma biblioteca para facilitar o a implementação de Lazy Loading com React.

## Instalação

Você pode instalar o pacote via NPM:

```bash
npm install @bentoo/react-lazy
```
ou via Yarn:

```bash
yarn add @bentoo/react-lazy
```
ou via pnpm
```bash
pnpm add @bentoo/react-lazy
```

## Uso

Aqui está um exemplo básico de como usar o `@bentoo/react-lazy` em seu projeto:

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

### Propriedades

`LazyComponent` aceita as seguintes propriedades:

| Propriedade | Tipo      | Descrição                     |
|-------------|-----------|-------------------------------|
| `fallback` |	`ReactNode` |	O conteúdo a ser exibido enquanto o componente está sendo carregado.|
|children	| `ReactNode`	| O conteúdo que será exibido após o carregamento.|

## Contribuição

Se você deseja contribuir, fique à vontade para abrir um pull request ou reportar um problema. 

1. Faça um fork do projeto.
2. Crie sua feature branch (`git checkout -b minha-nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adicionando nova funcionalidade'`).
4. Faça um push para a branch (`git push origin minha-nova-funcionalidade`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.